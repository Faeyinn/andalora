"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { ArrowRight, User } from "lucide-react";

export const MainCard = () => {
  const router = useRouter();

  const handleGuestLogin = async () => {
    const result = await Swal.fire({
      title: "Masuk sebagai Tamu?",
      text: "Anda akan mengakses marketplace dengan akses terbatas",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2D3250",
      cancelButtonColor: "#6B7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Memuat...",
        text: "Sedang mempersiapkan akses tamu",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: "rounded-2xl",
        },
      });

      setTimeout(() => {
        Swal.close();
        router.push("/marketplace");
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-4xl mx-auto px-4"
    >
      <div className="relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-16 overflow-hidden">
        {/* Decorative background blob inside card */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-white/50 border border-white/60 text-sm font-medium text-gray-600 shadow-sm backdrop-blur-sm">
              ✨ Marketplace Mahasiswa #1
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D3250] to-[#7077A1]">
              ANDALORA
            </span>
          </motion.h1>

          <motion.div
            className="space-y-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xl md:text-2xl font-medium text-gray-800 italic">
              &quot;Andalas Re-Owner Assets&quot;
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Platform jual beli barang bekas dan produk usaha mahasiswa yang
              aman, terpercaya, dan mudah digunakan.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/login" className="w-full">
              <button className="group w-full bg-[#2D3250] hover:bg-[#424769] text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Masuk Sekarang
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <button
              onClick={handleGuestLogin}
              className="group w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <User size={20} />
              Tamu
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
