import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/payments/webhook - Midtrans payment notification webhook
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { order_id, transaction_status, fraud_status, transaction_id } = body;

    console.log("Midtrans notification:", body);

    const supabase = await createClient();

    // Get payment by order_id
    const { data: payment, error: fetchError } = await supabase
      .from("listing_payments")
      .select("*, product:products(id, user_id)")
      .eq("midtrans_order_id", order_id)
      .single();

    if (fetchError || !payment) {
      console.error("Payment not found:", order_id);
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    let paymentStatus = payment.status;
    let productStatus = payment.product.status;

    // Handle transaction status
    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        paymentStatus = "paid";
        productStatus = "active";
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "paid";
      productStatus = "active";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "failed";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    }

    // Update payment
    const { error: updatePaymentError } = await supabase
      .from("listing_payments")
      .update({
        status: paymentStatus,
        midtrans_transaction_id: transaction_id,
        paid_at: paymentStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      console.error("Error updating payment:", updatePaymentError);
    }

    // If payment is successful, update product status and set expiry
    if (paymentStatus === "paid") {
      // Get listing plan to calculate expiry
      const { data: listingPlan } = await supabase
        .from("listing_plans")
        .select("duration_days")
        .eq("id", payment.listing_plan_id)
        .single();

      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() + (listingPlan?.duration_days || 30)
      );

      // Update product
      const { error: updateProductError } = await supabase
        .from("products")
        .update({
          status: "active",
          listing_plan_id: payment.listing_plan_id,
          listing_expires_at: expiresAt.toISOString(),
        })
        .eq("id", payment.product_id);

      if (updateProductError) {
        console.error("Error updating product:", updateProductError);
      }

      // Create notification for user
      await supabase.from("notifications").insert({
        user_id: payment.product.user_id,
        type: "payment_success",
        title: "Pembayaran Berhasil",
        message:
          "Pembayaran listing produk Anda telah berhasil. Produk Anda sekarang aktif di marketplace.",
        related_product_id: payment.product_id,
      });
    } else if (paymentStatus === "failed") {
      // Create notification for failed payment
      await supabase.from("notifications").insert({
        user_id: payment.product.user_id,
        type: "payment_failed",
        title: "Pembayaran Gagal",
        message: "Pembayaran listing produk Anda gagal. Silakan coba lagi.",
        related_product_id: payment.product_id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notification processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
