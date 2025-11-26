import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/listing-plans - Get all active listing plans (public)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listing_plans")
      .select("*")
      .eq("is_active", true)
      .order("duration_days", { ascending: true });

    if (error) {
      console.error("Error fetching listing plans:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data paket listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get listing plans error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
