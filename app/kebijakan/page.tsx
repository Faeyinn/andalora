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
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Kebijakan Penggunaan
              </h1>
              <p className="text-sm text-gray-500 mt-1">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Pendahuluan</h2>
              <p className="text-sm">Selamat datang di Andalora. Kebijakan ini menjelaskan aturan dan ketentuan penggunaan platform kami. Dengan mengakses atau menggunakan Andalora, Anda setuju untuk mematuhi kebijakan ini.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Barang yang Dilarang</h2>
                <p className="text-sm mb-2">Untuk menjaga keamanan komunitas, pengguna dilarang menawarkan barang atau layanan berikut.</p>
                <p className="text-sm">Barang ilegal atau hasil curian. Senjata tajam dan bahan peledak. Obat-obatan terlarang. Konten dewasa atau pornografi. Barang palsu atau tiruan.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Etika Bertransaksi</h2>
              <p className="text-sm">Pengguna diharapkan melakukan transaksi secara jujur dan profesional. Tindakan penipuan, pelecehan, atau perilaku merugikan lainnya dapat mengakibatkan tindakan administratif, termasuk penghapusan akun.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Sanksi Pelanggaran</h2>
              <p className="text-sm">Andalora berhak menghapus konten, menangguhkan, atau menghentikan akses pengguna yang melanggar kebijakan ini tanpa pemberitahuan terlebih dahulu.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
