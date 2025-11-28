"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900"
            >
              Tentang Andalora
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Marketplace pertama yang didedikasikan untuk mahasiswa Universitas
              Andalas. Menghubungkan penjual dan pembeli dalam satu ekosistem
              kampus yang aman dan terpercaya.
            </motion.p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Komunitas",
                desc: "Membangun komunitas jual beli yang solid antar mahasiswa.",
              },
              {
                icon: Target,
                title: "Misi",
                desc: "Memudahkan mahasiswa memenuhi kebutuhan kuliah dengan harga terjangkau.",
              },
              {
                icon: Heart,
                title: "Kepercayaan",
                desc: "Mengutamakan keamanan dan kejujuran dalam setiap transaksi.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-600 mb-6">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm"
          >
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Cerita Kami</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Andalora lahir dari keresahan mahasiswa yang kesulitan mencari
                barang bekas berkualitas di sekitar kampus. Kami percaya bahwa
                barang yang tidak lagi terpakai bagi seseorang bisa menjadi
                harta karun bagi orang lain. Dengan semangat kolaborasi, kami
                membangun platform ini untuk memudahkan sirkulasi barang di
                lingkungan kampus.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
