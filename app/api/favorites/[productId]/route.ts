import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// DELETE /api/favorites/[productId] - Remove product from favorites
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id"); // for guest

    const supabase = await createClient();

    // Try to get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase.from("favorites").delete().eq("product_id", productId);

    if (user) {
      // Authenticated user
      query = query.eq("user_id", user.id);
    } else if (sessionId) {
      // Guest user
      query = query.eq("session_id", sessionId);
    } else {
      return NextResponse.json(
        { success: false, error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const { error } = await query;

    if (error) {
      console.error("Error removing favorite:", error);
      return NextResponse.json(
        { success: false, error: "Gagal menghapus dari favorit" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus dari favorit",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
