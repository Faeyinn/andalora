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

    // Date ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch stats
    const [
      { count: totalUsers },
      { count: totalProducts },
      { count: activeProducts },
      { count: soldProducts },
      { count: newUsersCurrent },
      { count: newUsersPrev },
      { count: newProductsCurrent },
      { count: newProductsPrev },
      { count: activeProductsCurrent },
      { count: activeProductsPrev },
      { count: soldProductsCurrent },
      { count: soldProductsPrev },
      { data: salesDataRaw },
      { data: productsDataRaw },
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
      // Trends: Users
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", fourteenDaysAgo.toISOString())
        .lt("created_at", sevenDaysAgo.toISOString()),
      // Trends: Total Products
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .gte("created_at", fourteenDaysAgo.toISOString())
        .lt("created_at", sevenDaysAgo.toISOString()),
      // Trends: Active Products (Newly active)
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .gte("created_at", sevenDaysAgo.toISOString()),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .gte("created_at", fourteenDaysAgo.toISOString())
        .lt("created_at", sevenDaysAgo.toISOString()),
      // Trends: Sold Products
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "sold")
        .gte("updated_at", sevenDaysAgo.toISOString()),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "sold")
        .gte("updated_at", fourteenDaysAgo.toISOString())
        .lt("updated_at", sevenDaysAgo.toISOString()),

      // Fetch sold products for sales chart (last 7 days)
      supabase
        .from("products")
        .select("price, updated_at")
        .eq("status", "sold")
        .gte("updated_at", sevenDaysAgo.toISOString())
        .order("updated_at", { ascending: true }),
      // Fetch product activity (last 7 days)
      supabase
        .from("products")
        .select("status, created_at, updated_at")
        .gte("created_at", sevenDaysAgo.toISOString()),
    ]);

    // Calculate Trends
    const calculateTrend = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    const trends = {
      users: calculateTrend(newUsersCurrent || 0, newUsersPrev || 0),
      products: calculateTrend(newProductsCurrent || 0, newProductsPrev || 0),
      active: calculateTrend(
        activeProductsCurrent || 0,
        activeProductsPrev || 0
      ),
      sold: calculateTrend(soldProductsCurrent || 0, soldProductsPrev || 0),
    };

    // Process Sales Data
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const salesMap = new Map<string, number>();
    const productsMap = new Map<
      string,
      { active: number; sold: number; date: Date }
    >();

    // Initialize maps for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      salesMap.set(dayName, 0);
      productsMap.set(dayName, { active: 0, sold: 0, date: d });
    }

    // Aggregate Sales
    salesDataRaw?.forEach((item) => {
      const date = new Date(item.updated_at);
      const dayName = days[date.getDay()];
      if (salesMap.has(dayName)) {
        salesMap.set(dayName, (salesMap.get(dayName) || 0) + item.price);
      }
    });

    // Aggregate Product Activity
    productsDataRaw?.forEach((item) => {
      const createdDate = new Date(item.created_at);
      const createdDay = days[createdDate.getDay()];

      if (productsMap.has(createdDay)) {
        const current = productsMap.get(createdDay)!;
        if (item.status === "active") {
          current.active++;
        }
      }

      if (item.status === "sold") {
        const soldDate = new Date(item.updated_at);
        const soldDay = days[soldDate.getDay()];
        if (productsMap.has(soldDay)) {
          const current = productsMap.get(soldDay)!;
          current.sold++;
        }
      }
    });

    const salesChartData = Array.from(salesMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    const productsChartData = Array.from(productsMap.entries()).map(
      ([name, data]) => ({
        name,
        active: data.active,
        sold: data.sold,
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        soldProducts: soldProducts || 0,
        trends,
        salesChart: salesChartData,
        productsChart: productsChartData,
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
