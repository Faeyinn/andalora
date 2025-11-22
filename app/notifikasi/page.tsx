"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { FilterTabs } from "@/components/notifikasi/FilterTabs";
import { NotifikasiCard } from "@/components/notifikasi/NotifikasiCard";

// Dummy data notifikasi
const notifikasiData = [
  {
    id: 1,
    title: "Toko Hanabi",
    description:
      "Pesanan Anda telah berhasil dibuat. Silakan cek detail pesanan di halaman profil Anda.",
    category: "semua",
  },
  {
    id: 2,
    title: "Nana Shop",
    description:
      "Pembayaran untuk pesanan Anda telah kami terima. Penjual akan segera memproses pesanan Anda.",
    category: "belum-dibaca",
  },
  {
    id: 3,
    title: "EduMart",
    description:
      "Promo spesial hari ini! Dapatkan diskon hingga 30% untuk produk pilihan. Jangan lewatkan kesempatan ini!",
    category: "semua",
  },
  {
    id: 4,
    title: "Toko Andalas",
    description:
      "Pesanan Anda telah dibatalkan sesuai permintaan. Jika ada pertanyaan, silakan hubungi penjual.",
    category: "spam",
  },
  {
    id: 5,
    title: "Nana Shop",
    description:
      "Penjual telah mengirimkan barang pesanan Anda. Cek resi pengiriman di detail pesanan.",
    category: "belum-dibaca",
  },
];

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState("semua");

  const filteredData =
    activeTab === "semua"
      ? notifikasiData
      : notifikasiData.filter((item) => item.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 container mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl text-gray-800 font-bold mb-8"
        >
          Halo Guest!
        </motion.h1>

        {/* Filter Tabs */}
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Notifikasi Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <NotifikasiCard
              key={item.id}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}