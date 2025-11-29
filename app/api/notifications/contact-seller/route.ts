import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("title, user_id")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Don't notify if user is contacting themselves
    if (product.user_id === user.id) {
      return NextResponse.json({ success: true });
    }

    // Get buyer details
    const { data: buyer } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const buyerName = buyer?.full_name || "Seseorang";

    // Create notification
    const { error: notifError } = await supabase.from("notifications").insert({
      user_id: product.user_id,
      title: "Peminat Baru!",
      message: `${buyerName} tertarik dengan produk Anda "${product.title}" dan mungkin akan menghubungi via WhatsApp.`,
      type: "transaction",
      link: `/marketplace/product/${product_id}`,
      related_product_id: product_id,
    });

    if (notifError) {
      console.error("Error creating notification:", notifError);
      // Don't fail the request, just log it
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact seller notification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
