import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/createNotification";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

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
      .from("products")
      .select(
        `
        *,
        user:users(id, full_name, email),
        category:categories(id, name)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
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
    console.error("Admin products error:", error);
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
      { success: false, error: "Product ID is required" },
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

    // Delete related data first using admin client
    const supabaseAdmin = createAdminClient();

    // Fetch product info to notify owner
    const { data: productToDelete } = await supabase
      .from("products")
      .select("id, user_id, title")
      .eq("id", id)
      .single();

    // 1. Delete transactions
    await supabaseAdmin.from("transactions").delete().eq("product_id", id);

    // 2. Delete listing payments
    await supabaseAdmin.from("listing_payments").delete().eq("product_id", id);

    // 3. Delete favorites
    await supabaseAdmin.from("favorites").delete().eq("product_id", id);

    // 4. Delete notifications related to this product
    await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("related_product_id", id);

    // Notify owner that product was deleted by admin
    if (productToDelete && productToDelete.user_id) {
      await createNotification({
        userId: productToDelete.user_id,
        type: "product_deleted_by_admin",
        title: "Produk Dihapus oleh Admin",
        message: `Produk Anda "${productToDelete.title}" telah dihapus oleh admin. Hubungi support jika perlu bantuan.`,
      });
    }

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      // Check for foreign key constraint violation
      if (error.code === "23503") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Produk tidak dapat dihapus karena masih ada data terkait yang tidak dapat dihapus otomatis.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Gagal menghapus produk" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and Status are required" },
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
      .from("products")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update product status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
