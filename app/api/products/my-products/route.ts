import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET /api/products/my-products - Get user's own products (all statuses)
export async function GET() {
  try {
    const supabase = await createClient();
    // Use admin client for fetching data to bypass RLS
    const adminSupabase = createAdminClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Get user's products (all statuses)
    // Use admin client to ensure we can fetch the joined user data if needed (though for own products RLS might allow it, this is safer)
    const { data, error } = await adminSupabase
      .from("products")
      .select(
        `
        *,
        category:categories(id, name, slug),
        listing_plan:listing_plans(id, name, duration_days, price),
        user:users(id, full_name, whatsapp, university, avatar_url)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user products:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data produk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get user products error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
