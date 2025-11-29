import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { SignupRequest } from "@/types";

export async function POST(request: Request) {
  try {
    let body: SignupRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { email, password, full_name, phone, whatsapp, university, nim } =
      body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !full_name ||
      !phone ||
      !whatsapp ||
      !university ||
      !nim
    ) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          whatsapp,
          university,
          nim,
        },
      },
    });

    if (authError) {
      console.error("Signup error:", authError);
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "Gagal membuat akun" },
        { status: 500 }
      );
    }

    // Get user profile (created by trigger)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);
    }

    // Sign out user immediately after signup so they need to login
    // This prevents middleware from auto-redirecting to marketplace
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil. Silakan login untuk melanjutkan.",
      data: {
        user: userData || {
          id: authData.user.id,
          email: authData.user.email,
          full_name,
          phone,
          whatsapp,
          university,
          nim,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
