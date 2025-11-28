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
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-6"
            >
              <FileText size={32} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Syarat & Ketentuan
            </h1>
            <p className="text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="prose prose-lg prose-blue max-w-none text-gray-600">
            <h3>1. Ketentuan Umum</h3>
            <p>
              Syarat dan ketentuan ini merupakan perjanjian antara pengguna
              (&quot;Anda&quot;) dan Andalora (&quot;Kami&quot;). Dengan
              mendaftar atau menggunakan layanan kami, Anda dianggap telah
              membaca dan menyetujui seluruh isi perjanjian ini.
            </p>

            <h3>2. Akun Pengguna</h3>
            <p>
              Anda bertanggung jawab penuh atas keamanan akun dan password Anda.
              Kami tidak bertanggung jawab atas kerugian yang timbul akibat
              kelalaian Anda dalam menjaga kerahasiaan akun.
            </p>

            <h3>3. Transaksi</h3>
            <p>
              Andalora hanya menyediakan platform perantara. Kesepakatan harga,
              pengiriman, dan kondisi barang sepenuhnya menjadi tanggung jawab
              penjual dan pembeli.
            </p>

            <h3>4. Batasan Tanggung Jawab</h3>
            <p>
              Kami berupaya menjaga layanan tetap aman dan nyaman, namun kami
              tidak menjamin layanan akan selalu bebas dari gangguan atau error.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
