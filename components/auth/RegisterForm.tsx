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

  const normalizePhone = (input: string) => {
    if (!input) return input;
    // keep only digits
    let s = input.replace(/\D/g, "");
    // remove leading zeros
    s = s.replace(/^0+/, "");
    // if starts with 8 -> prefix 62 => 628...
    if (s.startsWith("8")) return `62${s}`;
    // if already starts with country code 62, return as-is
    if (s.startsWith("62")) return s;
    // fallback: prefix with 62
    return `62${s}`;
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "phone" && name !== "whatsapp") return;
    const normalized = normalizePhone(value);
    setFormData((prev) => ({ ...prev, [name]: normalized }));
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
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
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
              onBlur={handlePhoneBlur}
              placeholder="No. Telepon (628...)"
              className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              onBlur={handlePhoneBlur}
              placeholder="No. WhatsApp (628...)"
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

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-3 text-gray-500 text-sm">Atau</span>
            <div className="border-t border-gray-300 w-full"></div>
          </div>

          <button
            type="button"
            onClick={() => {
              Swal.fire({
                title: "Info",
                text: "Fitur login menggunakan Google sedang dikembangkan",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#2D3250",
              });
            }}
            className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-all shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Daftar dengan Google
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
