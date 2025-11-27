import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Verify signature (optional but recommended)
    // const signatureKey = body.signature_key;
    // const orderId = body.order_id;
    // const statusCode = body.status_code;
    // const grossAmount = body.gross_amount;
    // const serverKey = process.env.MIDTRANS_SERVER_KEY;
    // const input = orderId + statusCode + grossAmount + serverKey;
    // const signature = crypto.createHash('sha512').update(input).digest('hex');
    // if (signature !== signatureKey) {
    //   return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    // }

    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;
    const orderId = body.order_id;

    console.log(
      `Payment notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`
    );

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from("listing_payments")
      .select("*, listing_plan:listing_plans(*)")
      .eq("id", orderId)
      .single();

    if (paymentError || !payment) {
      console.error("Payment record not found:", orderId);
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    let newStatus = "pending";
    let paidAt = null;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        newStatus = "pending"; // Challenge
      } else if (fraudStatus == "accept") {
        newStatus = "paid";
        paidAt = new Date().toISOString();
      }
    } else if (transactionStatus == "settlement") {
      newStatus = "paid";
      paidAt = new Date().toISOString();
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      newStatus = "failed";
    } else if (transactionStatus == "pending") {
      newStatus = "pending";
    }

    // Update payment status
    await supabase
      .from("listing_payments")
      .update({
        status: newStatus,
        midtrans_transaction_id: body.transaction_id,
        payment_method: body.payment_type,
        paid_at: paidAt,
      })
      .eq("id", orderId);

    // If paid, activate product and set expiry
    if (newStatus === "paid") {
      const durationDays = payment.listing_plan.duration_days;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      await supabase
        .from("products")
        .update({
          status: "active",
          listing_plan_id: payment.listing_plan_id,
          listing_expires_at: expiresAt.toISOString(),
        })
        .eq("id", payment.product_id);

      console.log(
        `Product ${
          payment.product_id
        } activated until ${expiresAt.toISOString()}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
