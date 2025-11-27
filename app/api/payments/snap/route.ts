import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
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

    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Get listing plan details
    const { data: plan, error: planError } = await supabase
      .from("listing_plans")
      .select("*")
      .eq("id", listingPlanId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { success: false, error: "Listing plan not found" },
        { status: 404 }
      );
    }

    // Create listing payment record
    const { data: payment, error: paymentError } = await supabase
      .from("listing_payments")
      .insert({
        product_id: productId,
        user_id: user.id,
        listing_plan_id: listingPlanId,
        amount: plan.price,
        status: "pending",
        payment_method: "midtrans",
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      return NextResponse.json(
        { success: false, error: "Failed to create payment record" },
        { status: 500 }
      );
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    });

    // Create transaction parameters
    const parameter = {
      transaction_details: {
        order_id: payment.id, // Use payment ID as order ID
        gross_amount: plan.price,
      },
      customer_details: {
        first_name: user.user_metadata.full_name,
        email: user.email,
        phone: user.user_metadata.phone,
      },
      item_details: [
        {
          id: plan.id,
          price: plan.price,
          quantity: 1,
          name: `Listing: ${product.title} (${plan.name})`,
        },
      ],
    };

    // Get Snap Token
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // Update payment record with Snap Token
    await supabase
      .from("listing_payments")
      .update({
        midtrans_snap_token: snapToken,
        midtrans_order_id: payment.id,
      })
      .eq("id", payment.id);

    return NextResponse.json({
      success: true,
      token: snapToken,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Snap token error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
