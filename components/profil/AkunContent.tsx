"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import Image from "next/image";
import { Camera, Trash2, User } from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/utils/api";

export const AkunContent = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    university: "",
    nim: "",
  });

  // Update form data when user data is available
  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || "",
        university: user.university || "",
        nim: user.nim || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      whatsapp: user?.whatsapp || "",
      university: user?.university || "",
      nim: user?.nim || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      whatsapp: user?.whatsapp || "",
      university: user?.university || "",
      nim: user?.nim || "",
    });
  };

  const handleSave = async () => {
    if (
      !formData.full_name ||
      !formData.phone ||
      !formData.whatsapp ||
      !formData.university ||
      !formData.nim
    ) {
      Swal.fire({
        title: "Perhatian!",
        text: "Semua field wajib diisi",
        icon: "warning",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        await refreshUser();
        setIsEditing(false);

        Swal.fire({
          title: "Berhasil!",
          text: "Profil berhasil diperbarui",
          icon: "success",
          confirmButtonColor: "#2D3250",
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: result.error || "Gagal memperbarui profil",
          icon: "error",
          confirmButtonColor: "#2D3250",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Swal.fire({
        title: "Error!",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui profil",
        icon: "error",
        confirmButtonColor: "#2D3250",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Format Tidak Valid",
        text: "Hanya file JPG, PNG, dan WebP yang diperbolehkan",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: "Ukuran file maksimal 2MB",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Delete old avatar if exists
      if (user?.avatar_url) {
        await deleteImage(user.avatar_url);
      }

      // Upload new avatar
      const uploadResult = await uploadImage(file);

      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || "Gagal upload gambar");
      }

      // Update profile with new avatar URL
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: uploadResult.data.url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        await refreshUser();
        Swal.fire({
          title: "Berhasil!",
          text: "Foto profil berhasil diperbarui",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(result.error || "Gagal update profil");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      Swal.fire({
        title: "Gagal!",
        text:
          error instanceof Error ? error.message : "Gagal upload foto profil",
        icon: "error",
        confirmButtonColor: "#2D3250",
      });
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar_url) return;

    const result = await Swal.fire({
      title: "Hapus Foto Profil?",
      text: "Foto profil akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    setIsUploadingAvatar(true);

    try {
      // Delete from storage
      await deleteImage(user.avatar_url);

      // Update profile to remove avatar URL
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: null }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResult = await response.json();

      if (apiResult.success) {
        await refreshUser();
        Swal.fire({
          title: "Berhasil!",
          text: "Foto profil berhasil dihapus",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(apiResult.error || "Gagal hapus foto profil");
      }
    } catch (error) {
      console.error("Delete avatar error:", error);
      Swal.fire({
        title: "Gagal!",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus foto profil",
        icon: "error",
        confirmButtonColor: "#2D3250",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#2D3250] to-[#424769] px-8 py-12 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Informasi Akun</h2>
          <p className="text-gray-200">Kelola informasi profil Anda</p>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#2D3250] to-[#424769] flex items-center justify-center shadow-lg">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>

            {/* Upload button */}
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border-2 border-gray-200 ${
                isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-gray-700" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {user.full_name}
            </h3>
            <p className="text-gray-500 mb-3">{user.email}</p>
            <div className="flex gap-3">
              {user.avatar_url && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={isUploadingAvatar}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Foto
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm bg-[#2D3250] text-white rounded-lg hover:bg-[#1f2337] transition-colors"
                >
                  Edit Profil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email (read-only) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                Tidak dapat diubah
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                isEditing
                  ? "bg-white border-[#2D3250] focus:outline-none focus:ring-2 focus:ring-[#2D3250]/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>

          {/* NIM */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              NIM *
            </label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                isEditing
                  ? "bg-white border-[#2D3250] focus:outline-none focus:ring-2 focus:ring-[#2D3250]/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              No. Telepon *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                isEditing
                  ? "bg-white border-[#2D3250] focus:outline-none focus:ring-2 focus:ring-[#2D3250]/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              No. WhatsApp *
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                isEditing
                  ? "bg-white border-[#2D3250] focus:outline-none focus:ring-2 focus:ring-[#2D3250]/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>

          {/* University */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Universitas *
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                isEditing
                  ? "bg-white border-[#2D3250] focus:outline-none focus:ring-2 focus:ring-[#2D3250]/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#2D3250] text-white rounded-xl hover:bg-[#1f2337] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
