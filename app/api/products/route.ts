import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { CreateProductRequest } from "@/types";

// GET /api/products - List all active products (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const condition = searchParams.get("condition") || "";
    const minPrice = searchParams.get("min_price")
      ? parseFloat(searchParams.get("min_price")!)
      : undefined;
    const maxPrice = searchParams.get("max_price")
      ? parseFloat(searchParams.get("max_price")!)
      : undefined;
    const sort = searchParams.get("sort") || "newest";

    // Use admin client to bypass RLS for public product listing to ensure user data is visible
    const supabase = createAdminClient();

    // Build query
    // Check if category is UUID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        category
      );

    // Build query
    // If filtering by slug, use inner join to allow filtering on joined table
    const selectQuery =
      category && !isUUID
        ? `
        *,
        user:users(id, full_name, whatsapp, university),
        category:categories!inner(id, name, slug)
      `
        : `
        *,
        user:users(id, full_name, whatsapp, university),
        category:categories(id, name, slug)
      `;

    let query = supabase
      .from("products")
      .select(selectQuery, { count: "exact" })
      .eq("status", "active");

    // Apply filters
    if (category) {
      if (isUUID) {
        query = query.eq("category_id", category);
      } else {
        query = query.eq("category.slug", category);
      }
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (condition) {
      query = query.eq("condition", condition);
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    // Apply sorting
    switch (sort) {
      case "price_low":
        query = query.order("price", { ascending: true });
        break;
      case "price_high":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data produk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (authenticated)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

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

    const body: CreateProductRequest = await request.json();
    const { title, description, price, category_id, condition, images } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !category_id ||
      !condition ||
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Validate price
    if (price <= 0) {
      return NextResponse.json(
        { success: false, error: "Harga harus lebih dari 0" },
        { status: 400 }
      );
    }

    // Validate condition
    const validConditions = ["baru", "seperti baru", "bekas baik", "bekas"];
    if (!validConditions.includes(condition)) {
      return NextResponse.json(
        { success: false, error: "Kondisi barang tidak valid" },
        { status: 400 }
      );
    }

    // Create product with status pending_payment
    const { data, error } = await supabase
      .from("products")
      .insert({
        user_id: user.id,
        title,
        description,
        price,
        category_id,
        condition,
        images,
        status: "pending_payment",
      })
      .select(
        `
        *,
        user:users(id, full_name, whatsapp),
        category:categories(id, name, slug)
      `
      )
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { success: false, error: "Gagal membuat produk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Produk berhasil dibuat. Silakan pilih paket listing dan lakukan pembayaran.",
      data,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
