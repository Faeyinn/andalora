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
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900"
            >
              Tentang Andalora
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="text-md text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed"
            >
              Andalora adalah marketplace yang dirancang untuk mendukung kebutuhan
              mahasiswa Universitas Andalas — menghadirkan transaksi yang aman,
              mudah, dan berorientasi komunitas kampus.
            </motion.p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.05 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mx-auto text-purple-600 mb-4">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </motion.div>
                );
            })}
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Cerita Kami</h2>
              <p className="text-gray-600 leading-relaxed mt-4">
                Andalora bermula dari kebutuhan untuk mempermudah sirkulasi barang
                di lingkungan kampus. Kami membantu mahasiswa menemukan barang
                berkualitas dengan proses yang transparan dan terpercaya.
              </p>
            </div>
          </motion.div>

          {/* Team Section */}
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tim Andalora</h2>
              <p className="text-sm text-gray-500 mb-6">Tim pengembang dan inisiator proyek Andalora.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: "Muhammad Rayhan Ramadhan", nim: "2211513052" },
                  { name: "Athallah Fajri", nim: "2311511008" },
                  { name: "Shaza Zulfiani", nim: "2311511018" },
                  { name: "Asyratul Mufidah Andini", nim: "2311512010" },
                  { name: "Rahmat Fajar Saputra", nim: "2311512036" },
                  { name: "Aditya Khiswanda", nim: "2311513012" },
                ].map((member) => (
                  <div key={member.nim} className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-100 hover:shadow-md transition">
                    <img
                      src="/icon-placeholder.jpg"
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">NIM {member.nim}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
