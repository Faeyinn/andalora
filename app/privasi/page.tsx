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
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Lock size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Kebijakan Privasi</h1>
              <p className="text-sm text-gray-500 mt-1">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Data yang Kami Kumpulkan</h2>
              <p className="text-sm">Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama, email, nomor telepon, dan data kampus. Kami juga mengumpulkan data aktivitas Anda di platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Penggunaan Data</h2>
              <p className="text-sm">Data Anda digunakan untuk memproses transaksi dan pesanan, meningkatkan layanan dan pengalaman pengguna, mengirimkan informasi promo atau update penting, serta mencegah penipuan dan aktivitas ilegal.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Keamanan Data</h2>
              <p className="text-sm">Kami menggunakan standar keamanan industri untuk melindungi data pribadi Anda. Kami tidak akan menjual atau menyewakan data Anda kepada pihak ketiga tanpa persetujuan Anda.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Hak Anda</h2>
              <p className="text-sm">Anda berhak untuk mengakses, mengubah, atau menghapus data pribadi Anda kapan saja melalui pengaturan akun.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
