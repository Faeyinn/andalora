import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// PUT /api/notifications/[id]/read - Mark notification as read
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update notification
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating notification:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengupdate notifikasi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifikasi ditandai sebagai sudah dibaca",
      data,
    });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
