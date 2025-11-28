"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import {
  BookOpen,
  Camera,
  DollarSign,
  MessageCircle,
  Package,
  ShieldCheck,
} from "lucide-react";

export default function SellerGuidePage() {
  const steps = [
    {
      icon: Camera,
      title: "1. Foto Produk Menarik",
      description:
        "Gunakan pencahayaan yang baik dan ambil foto dari berbagai sudut. Foto yang jelas meningkatkan kepercayaan pembeli.",
    },
    {
      icon: BookOpen,
      title: "2. Deskripsi Lengkap",
      description:
        "Jelaskan kondisi barang secara jujur. Sebutkan jika ada cacat atau kekurangan. Kejujuran adalah kunci reputasi.",
    },
    {
      icon: DollarSign,
      title: "3. Harga Kompetitif",
      description:
        "Cek harga pasar untuk barang serupa. Berikan harga yang wajar agar barang cepat terjual.",
    },
    {
      icon: MessageCircle,
      title: "4. Respon Cepat",
      description:
        "Balas chat pembeli dengan ramah dan cepat. Pembeli lebih suka penjual yang komunikatif.",
    },
    {
      icon: Package,
      title: "5. Kemas dengan Aman",
      description:
        "Pastikan barang dikemas dengan rapi dan aman agar tidak rusak saat pengiriman atau COD.",
    },
    {
      icon: ShieldCheck,
      title: "6. Transaksi Aman",
      description:
        "Gunakan fitur pembayaran di Andalora untuk keamanan bersama. Hindari transfer langsung ke rekening pribadi.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-600 mb-6"
            >
              <BookOpen size={32} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900"
            >
              Panduan Penjual
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Tips dan trik sukses berjualan di Andalora. Tingkatkan penjualanmu
              dengan langkah mudah ini.
            </motion.p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
