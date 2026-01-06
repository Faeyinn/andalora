import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user with timeout
    const getUserPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Auth check timeout")), 8000)
    );

    const {
      data: { user },
      error: authError,
    } = await Promise.race([getUserPromise, timeoutPromise]) as {
      data: { user: any };
      error: any;
    };

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Get user profile with timeout
    const profilePromise = supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    const profileTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), 8000)
    );

    const { data: userData, error: userError } = await Promise.race([
      profilePromise,
      profileTimeoutPromise,
    ]) as { data: any; error: any };

    if (userError) {
      console.error("Error fetching user profile:", userError);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data profil" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    // Return 401 if timeout, so client knows to retry or handle gracefully
    if (error?.message?.includes("timeout")) {
      return NextResponse.json(
        { success: false, error: "Request timeout" },
        { status: 408 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
