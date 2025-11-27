import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
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

    // Check admin role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Fetch stats
    const [
      { count: totalUsers },
      { count: totalProducts },
      { count: activeProducts },
      { count: soldProducts },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "sold"),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        soldProducts: soldProducts || 0,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
