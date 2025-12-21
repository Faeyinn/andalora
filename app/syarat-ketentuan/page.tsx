"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Syarat &amp; Ketentuan</h1>
              <p className="text-sm text-gray-500 mt-1">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Ketentuan Umum</h2>
              <p className="text-sm">Syarat dan ketentuan ini merupakan perjanjian antara pengguna ("Anda") dan Andalora ("Kami"). Dengan mendaftar atau menggunakan layanan kami, Anda dianggap telah membaca dan menyetujui seluruh isi perjanjian ini.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Akun Pengguna</h2>
              <p className="text-sm">Anda bertanggung jawab penuh atas keamanan akun dan password Anda. Kami tidak bertanggung jawab atas kerugian yang timbul akibat kelalaian Anda dalam menjaga kerahasiaan akun.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Transaksi</h2>
              <p className="text-sm">Andalora hanya menyediakan platform perantara. Kesepakatan harga, pengiriman, dan kondisi barang sepenuhnya menjadi tanggung jawab penjual dan pembeli.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Batasan Tanggung Jawab</h2>
              <p className="text-sm">Kami berupaya menjaga layanan tetap aman dan nyaman, namun kami tidak menjamin layanan akan selalu bebas dari gangguan atau error.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
