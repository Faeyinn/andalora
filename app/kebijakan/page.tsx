"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-600 mb-6"
            >
              <Shield size={32} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kebijakan Penggunaan
            </h1>
            <p className="text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="prose prose-lg prose-purple max-w-none text-gray-600">
            <h3>1. Pendahuluan</h3>
            <p>
              Selamat datang di Andalora. Kebijakan ini mengatur penggunaan
              platform kami. Dengan mengakses Andalora, Anda menyetujui untuk
              mematuhi kebijakan ini.
            </p>

            <h3>2. Barang yang Dilarang</h3>
            <p>
              Kami melarang penjualan barang-barang berikut demi keamanan
              komunitas:
            </p>
            <ul>
              <li>Barang ilegal atau curian</li>
              <li>Senjata tajam dan bahan peledak</li>
              <li>Obat-obatan terlarang</li>
              <li>Konten dewasa atau pornografi</li>
              <li>Barang palsu atau tiruan (KW)</li>
            </ul>

            <h3>3. Etika Bertransaksi</h3>
            <p>
              Pengguna diharapkan untuk selalu bertransaksi dengan jujur dan
              sopan. Segala bentuk penipuan, pelecehan, atau tindakan merugikan
              lainnya akan ditindak tegas, termasuk pemblokiran akun permanen.
            </p>

            <h3>4. Sanksi Pelanggaran</h3>
            <p>
              Andalora berhak untuk menghapus konten, menangguhkan, atau
              menghentikan akses pengguna yang melanggar kebijakan ini tanpa
              pemberitahuan sebelumnya.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
