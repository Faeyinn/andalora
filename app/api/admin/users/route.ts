import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  try {
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check authentication & admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Use admin client for all deletions to bypass RLS and ensure complete cleanup
    const supabaseAdmin = createAdminClient();

    // 1. Delete Support Data
    // Delete tickets owned by user (and messages within them)
    const { data: userTickets } = await supabaseAdmin
      .from("support_tickets")
      .select("id")
      .eq("user_id", id);

    if (userTickets && userTickets.length > 0) {
      const ticketIds = userTickets.map((t) => t.id);
      // Delete messages in those tickets
      await supabaseAdmin
        .from("support_messages")
        .delete()
        .in("ticket_id", ticketIds);
      // Delete the tickets
      await supabaseAdmin.from("support_tickets").delete().in("id", ticketIds);
    }

    // Delete messages sent by user in any ticket
    await supabaseAdmin.from("support_messages").delete().eq("sender_id", id);

    // 2. Delete Transactions & Payments (as Buyer)
    await supabaseAdmin.from("transactions").delete().eq("user_id", id);
    await supabaseAdmin.from("listing_payments").delete().eq("user_id", id);

    // 3. Delete Favorites & Notifications
    await supabaseAdmin.from("favorites").delete().eq("user_id", id);
    await supabaseAdmin.from("notifications").delete().eq("user_id", id);

    // 4. Delete Products (and related data for those products)
    const { data: userProducts } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("user_id", id);

    if (userProducts && userProducts.length > 0) {
      const productIds = userProducts.map((p) => p.id);

      // Delete related data for these products
      await supabaseAdmin
        .from("transactions")
        .delete()
        .in("product_id", productIds);

      await supabaseAdmin
        .from("listing_payments")
        .delete()
        .in("product_id", productIds);

      await supabaseAdmin
        .from("favorites")
        .delete()
        .in("product_id", productIds);

      await supabaseAdmin
        .from("notifications")
        .delete()
        .in("related_product_id", productIds);

      // Delete the products
      await supabaseAdmin.from("products").delete().in("id", productIds);
    }

    // 5. Delete User from public.users
    const { error: publicDeleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id);

    if (publicDeleteError) {
      console.error("Error deleting public user:", publicDeleteError);
      return NextResponse.json(
        { success: false, error: "Gagal menghapus data user" },
        { status: 500 }
      );
    }

    // 6. Delete User from Auth (Critical)
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(id);

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      // Even if auth delete fails, we might want to return success if public data is gone,
      // but strictly speaking it's a partial failure.
      // However, usually if public data is gone, they can't do much.
      // But let's return error to be safe.
      return NextResponse.json(
        { success: false, error: "Gagal menghapus akun login user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { success: false, error: "ID and Role are required" },
        { status: 400 }
      );
    }

    // Check authentication & admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
