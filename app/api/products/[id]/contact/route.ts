import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get product details to find the seller
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("title, user_id")
      .eq("id", id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Don't notify if user is the seller
    if (product.user_id === user.id) {
      return NextResponse.json({ success: true });
    }

    // Create notification for the seller
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: product.user_id,
        title: "Peminat Baru!",
        message: `Seseorang tertarik dengan produk Anda: "${product.title}". Cek WhatsApp Anda.`,
        type: "transaction", // Using transaction type as it relates to a potential sale
        link: `/marketplace/product/${id}`,
      });

    if (notificationError) {
      console.error("Notification error:", notificationError);
      // Don't fail the request, just log it
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent",
    });
  } catch (error) {
    console.error("Contact seller error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
