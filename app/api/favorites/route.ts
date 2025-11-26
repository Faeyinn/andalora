import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/favorites - Get user's favorites (support guest and authenticated)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id"); // for guest

    const supabase = await createClient();

    // Try to get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from("favorites")
      .select(
        `
        *,
        product:products(
          *,
          user:users(id, full_name, whatsapp),
          category:categories(id, name, slug)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (user) {
      // Authenticated user
      query = query.eq("user_id", user.id);
    } else if (sessionId) {
      // Guest user
      query = query.eq("session_id", sessionId);
    } else {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data favorit" },
        { status: 500 }
      );
    }

    // Filter out favorites with deleted products
    const validFavorites = (data || []).filter((fav) => fav.product !== null);

    return NextResponse.json({
      success: true,
      data: validFavorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add product to favorites (support guest and authenticated)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { product_id, session_id } = body;

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: "Product ID diperlukan" },
        { status: 400 }
      );
    }

    // Try to get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = { product_id };

    if (user) {
      // Authenticated user
      insertData.user_id = user.id;
    } else if (session_id) {
      // Guest user
      insertData.session_id = session_id;
    } else {
      return NextResponse.json(
        { success: false, error: "Session ID diperlukan untuk guest" },
        { status: 400 }
      );
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, status")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (product.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Produk tidak tersedia" },
        { status: 400 }
      );
    }

    // Add to favorites
    const { data, error } = await supabase
      .from("favorites")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // Check if already favorited
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Produk sudah ada di favorit" },
          { status: 400 }
        );
      }
      console.error("Error adding favorite:", error);
      return NextResponse.json(
        { success: false, error: "Gagal menambahkan ke favorit" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan ke favorit",
      data,
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
