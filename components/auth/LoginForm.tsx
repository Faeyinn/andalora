"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        title: "Perhatian!",
        text: "Mohon isi semua field",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    setIsLoading(true);

    const result = await signIn(formData.email, formData.password);

    setIsLoading(false);

    if (result.success) {
      Swal.fire({
        title: "Berhasil!",
        text: "Login berhasil",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (result.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/marketplace");
        }
      }, 1500);
    } else {
      Swal.fire({
        title: "Login Gagal",
        text: result.error || "Email atau password salah",
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
          Log in to your account
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2D3250] hover:bg-[#1f2337] text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum ada akun?{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 font-medium hover:underline"
            >
              Create an account.
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
