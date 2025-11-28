"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-600 mb-6"
            >
              <Lock size={32} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="prose prose-lg prose-green max-w-none text-gray-600">
            <h3>1. Data yang Kami Kumpulkan</h3>
            <p>
              Kami mengumpulkan informasi yang Anda berikan saat mendaftar,
              seperti nama, email, nomor telepon, dan data kampus. Kami juga
              mengumpulkan data aktivitas Anda di platform.
            </p>

            <h3>2. Penggunaan Data</h3>
            <p>Data Anda digunakan untuk:</p>
            <ul>
              <li>Memproses transaksi dan pesanan</li>
              <li>Meningkatkan layanan dan pengalaman pengguna</li>
              <li>Mengirimkan informasi promo atau update penting</li>
              <li>Mencegah penipuan dan aktivitas ilegal</li>
            </ul>

            <h3>3. Keamanan Data</h3>
            <p>
              Kami menggunakan standar keamanan industri untuk melindungi data
              pribadi Anda. Kami tidak akan menjual atau menyewakan data Anda
              kepada pihak ketiga tanpa persetujuan Anda.
            </p>

            <h3>4. Hak Anda</h3>
            <p>
              Anda berhak untuk mengakses, mengubah, atau menghapus data pribadi
              Anda kapan saja melalui pengaturan akun.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
