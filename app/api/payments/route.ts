import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { CreatePaymentRequest } from "@/types";

// Midtrans client
import midtransClient from "midtrans-client";

// GET /api/payments - Get user's payment history
export async function GET() {
  try {
    const supabase = await createClient();

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

    const { data, error } = await supabase
      .from("listing_payments")
      .select(
        `
        *,
        product:products(id, title, images),
        listing_plan:listing_plans(id, name, duration_days, price)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data pembayaran" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create payment for product listing
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

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

    const body: CreatePaymentRequest = await request.json();
    const { product_id, listing_plan_id } = body;

    if (!product_id || !listing_plan_id) {
      return NextResponse.json(
        { success: false, error: "Product ID dan Listing Plan ID diperlukan" },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to user
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, user_id, title, status")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (product.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki akses untuk produk ini" },
        { status: 403 }
      );
    }

    if (product.status !== "pending_payment") {
      return NextResponse.json(
        { success: false, error: "Produk sudah memiliki pembayaran aktif" },
        { status: 400 }
      );
    }

    // Get listing plan
    const { data: listingPlan, error: planError } = await supabase
      .from("listing_plans")
      .select("*")
      .eq("id", listing_plan_id)
      .eq("is_active", true)
      .single();

    if (planError || !listingPlan) {
      return NextResponse.json(
        { success: false, error: "Paket listing tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: "Data user tidak ditemukan" },
        { status: 404 }
      );
    }

    // Create order ID
    const orderId = `LISTING-${product_id.substring(0, 8)}-${Date.now()}`;

    // Validate Midtrans environment variables
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!serverKey || !clientKey) {
      console.error("Missing Midtrans configuration");
      return NextResponse.json(
        { success: false, error: "Konfigurasi pembayaran tidak lengkap" },
        { status: 500 }
      );
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey,
      clientKey,
    });

    // Create transaction parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(listingPlan.price),
      },
      item_details: [
        {
          id: listing_plan_id,
          price: Math.round(listingPlan.price),
          quantity: 1,
          name: `${listingPlan.name} - ${product.title}`,
        },
      ],
      customer_details: {
        first_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
      },
    };

    // Create Snap transaction
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // Save payment to database
    const { data: payment, error: paymentError } = await supabase
      .from("listing_payments")
      .insert({
        product_id,
        user_id: user.id,
        listing_plan_id,
        amount: listingPlan.price,
        status: "pending",
        payment_method: "midtrans",
        midtrans_order_id: orderId,
        midtrans_snap_token: snapToken,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment:", paymentError);
      return NextResponse.json(
        { success: false, error: "Gagal membuat pembayaran" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dibuat",
      data: {
        payment,
        snap_token: snapToken,
        redirect_url: transaction.redirect_url,
      },
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
