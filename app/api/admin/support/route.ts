import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Check Admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // We rely on RLS 'Admins can view all tickets' policy,
    // but explicit check is good for API response status
    // (RLS would just return empty array if not admin)

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("support_tickets")
      .select("*, user:users(full_name, email)", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data tiket" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin tickets error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
