"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight } from "lucide-react";

export default function PromoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900"
            >
              Promo Spesial
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Dapatkan penawaran terbaik untuk kebutuhan kuliahmu. Jangan sampai
              ketinggalan!
            </motion.p>
          </div>

          {/* Promo List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Empty State for now */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm"
            >
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Belum ada promo aktif
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Saat ini belum ada promo yang tersedia. Pantau terus halaman ini
                untuk mendapatkan update terbaru!
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium">
                <Clock size={20} />
                Cek Lagi Nanti
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
