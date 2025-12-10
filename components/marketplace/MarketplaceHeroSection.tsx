"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag, ShieldCheck, Users } from "lucide-react";

export const MarketplaceHeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden py-12 lg:py-20">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero-product.png')" }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content (Text) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Platform Eksklusif Mahasiswa
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                Marketplace{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Barang Bekas
                </span>{" "}
                <br className="hidden lg:block" /> Antar Mahasiswa
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Temukan barang kebutuhan kuliah, jual barang yang tak terpakai,
                dan bertransaksi aman dengan sesama mahasiswa di lingkungan
                kampusmu.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => {
                  const element = document.getElementById("product-grid");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5" />
                Mulai Belanja
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/profil?tab=tambah-barang"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Jual Barang
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-gray-200/60"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Terverifikasi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Komunitas Kampus
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Content (Visual) */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative aspect-square md:aspect-[4/3] lg:aspect-square"
            >
              {/* Abstract Composition */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                {/* Clear Product Image on top */}
                <div className="absolute inset-0 bg-[url('/hero-product.png')] bg-cover bg-center" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
