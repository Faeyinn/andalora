import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { UpdateProductRequest } from "@/types";

// GET /api/products/[id] - Get product detail (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Use admin client to bypass RLS for public product details
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        user:users(id, full_name, whatsapp, university),
        category:categories(id, name, slug),
        listing_plan:listing_plans(id, name, duration_days, price)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Only show active products to public, or owner can see their own products
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (data.status !== "active" && (!user || user.id !== data.user_id)) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (authenticated, owner only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if product exists and user is owner
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingProduct.user_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Anda tidak memiliki akses untuk mengubah produk ini",
        },
        { status: 403 }
      );
    }

    const body: UpdateProductRequest = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    // Only update provided fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.price !== undefined) {
      if (body.price <= 0) {
        return NextResponse.json(
          { success: false, error: "Harga harus lebih dari 0" },
          { status: 400 }
        );
      }
      updateData.price = body.price;
    }
    if (body.category_id !== undefined)
      updateData.category_id = body.category_id;
    if (body.condition !== undefined) {
      const validConditions = ["baru", "seperti baru", "bekas baik", "bekas"];
      if (!validConditions.includes(body.condition)) {
        return NextResponse.json(
          { success: false, error: "Kondisi barang tidak valid" },
          { status: 400 }
        );
      }
      updateData.condition = body.condition;
    }
    if (body.images !== undefined) {
      if (body.images.length === 0) {
        return NextResponse.json(
          { success: false, error: "Minimal 1 gambar diperlukan" },
          { status: 400 }
        );
      }
      updateData.images = body.images;
    }
    if (body.status !== undefined) {
      const validStatuses = ["active", "sold", "pending_payment"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: "Status tidak valid" },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }

    // Update product
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        user:users(id, full_name, whatsapp),
        category:categories(id, name, slug)
      `
      )
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengupdate produk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diupdate",
      data,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (authenticated, owner only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if product exists and user is owner
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingProduct.user_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Anda tidak memiliki akses untuk menghapus produk ini",
        },
        { status: 403 }
      );
    }

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      // Check for foreign key constraint violation (Postgres code 23503)
      if (error.code === "23503") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Produk tidak dapat dihapus karena memiliki riwayat transaksi atau data terkait lainnya. Silahkan arsipkan produk atau hubungi admin.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Gagal menghapus produk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
