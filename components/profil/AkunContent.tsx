"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  Camera,
  Trash2,
  User,
  Mail,
  Phone,
  MessageCircle,
  School,
  CreditCard,
  Save,
  X,
} from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/utils/api";
import { motion } from "framer-motion";

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
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(result.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat memperbarui profil",
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
        text: "Gagal upload foto profil",
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
      await deleteImage(user.avatar_url);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: null }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      await refreshUser();
      Swal.fire({
        title: "Berhasil!",
        text: "Foto profil berhasil dihapus",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete avatar error:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus foto profil",
        icon: "error",
        confirmButtonColor: "#2D3250",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600">
                    <User size={48} />
                  </div>
                )}

                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>

              {user.avatar_url && (
                <button
                  onClick={handleDeleteAvatar}
                  className="absolute bottom-0 right-0 bg-red-100 text-red-600 p-2 rounded-full shadow-md hover:bg-red-200 transition-colors"
                  title="Hapus Foto"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-lg shadow-gray-900/20"
              >
                Edit Profil
              </button>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.full_name}
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Informasi Pribadi</h2>
          {isEditing && (
            <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
              Mode Edit
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              Nama Lengkap
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isEditing
                  ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white"
                  : "border-transparent bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-transparent bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              No. Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isEditing
                  ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white"
                  : "border-transparent bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageCircle size={16} className="text-gray-400" />
              WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isEditing
                  ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white"
                  : "border-transparent bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* University */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <School size={16} className="text-gray-400" />
              Universitas
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isEditing
                  ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white"
                  : "border-transparent bg-gray-50 text-gray-600"
              }`}
            />
          </div>

          {/* NIM */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              NIM
            </label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isEditing
                  ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white"
                  : "border-transparent bg-gray-50 text-gray-600"
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 pt-8 mt-8 border-t border-gray-100"
          >
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <X size={18} />
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg shadow-purple-500/30"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
