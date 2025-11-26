import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/upload - Upload image to Supabase Storage
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengupload gambar" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil diupload",
      data: {
        path: data.path,
        url: publicUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Supabase Storage
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
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

    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { success: false, error: "Path file tidak ditemukan" },
        { status: 400 }
      );
    }

    // Check if file belongs to user
    if (!path.startsWith(`${user.id}/`)) {
      return NextResponse.json(
        {
          success: false,
          error: "Anda tidak memiliki akses untuk menghapus file ini",
        },
        { status: 403 }
      );
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json(
        { success: false, error: "Gagal menghapus gambar" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
