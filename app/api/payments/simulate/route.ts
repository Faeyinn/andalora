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
    const { productId, listingPlanId } = body;

    if (!productId || !listingPlanId) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID and Listing Plan ID are required",
        },
        { status: 400 }
      );
    }

    // 1. Get Listing Plan details
    const { data: plan, error: planError } = await supabase
      .from("listing_plans")
      .select("*")
      .eq("id", listingPlanId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    // 2. Create Transaction Record (Simulated)
    const orderId = `SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        product_id: productId,
        listing_plan_id: listingPlanId,
        amount: plan.price,
        status: "success", // Directly success
        payment_type: "simulation",
        snap_token: "simulated-token",
        midtrans_order_id: orderId,
      });

    if (transactionError) {
      console.error("Transaction error:", transactionError);
      return NextResponse.json(
        { success: false, error: "Failed to create transaction" },
        { status: 500 }
      );
    }

    // 3. Update Product Status
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

    const { error: productError } = await supabase
      .from("products")
      .update({
        status: "active",
        listing_plan_id: listingPlanId,
        is_promoted: false, // Or true if plan implies it, but schema might not have it or logic differs
        expires_at: expiresAt.toISOString(),
      })
      .eq("id", productId);

    if (productError) {
      console.error("Product update error:", productError);
      return NextResponse.json(
        { success: false, error: "Failed to activate product" },
        { status: 500 }
      );
    }

    // 4. Create Notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Pembayaran Berhasil (Simulasi)",
      message: `Produk Anda telah aktif menggunakan paket ${plan.name}.`,
      type: "transaction",
      link: `/marketplace`,
    });

    return NextResponse.json({
      success: true,
      message: "Payment simulated successfully",
    });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
