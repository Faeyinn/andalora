"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export const RegisterForm = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    university: "",
    nim: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.whatsapp ||
      !formData.university ||
      !formData.nim ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Swal.fire({
        title: "Perhatian!",
        text: "Mohon isi semua field",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password harus sama",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        title: "Password Terlalu Pendek",
        text: "Password minimal 6 karakter",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    setIsLoading(true);

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      university: formData.university,
      nim: formData.nim,
    });

    setIsLoading(false);

    if (result.success) {
      Swal.fire({
        title: "Berhasil!",
        text: "Akun berhasil dibuat. Silakan login untuk melanjutkan.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      Swal.fire({
        title: "Registrasi Gagal",
        text: result.error || "Terjadi kesalahan saat membuat akun",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#2D3250",
      });
    }
  };

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Buat Akun
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="No. Telepon (08...)"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="No. WhatsApp (08...)"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              placeholder="Universitas"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleInputChange}
              placeholder="NIM (Nomor Induk Mahasiswa)"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password (min. 6 karakter)"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2D3250] hover:bg-[#1f2337] text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 font-medium hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
