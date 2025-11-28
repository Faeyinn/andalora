"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Briefcase, Code, PenTool, TrendingUp } from "lucide-react";

export default function CareerPage() {
  const positions = [
    {
      title: "Frontend Developer",
      type: "Internship",
      dept: "Engineering",
      icon: Code,
    },
    {
      title: "UI/UX Designer",
      type: "Part-time",
      dept: "Design",
      icon: PenTool,
    },
    {
      title: "Marketing Specialist",
      type: "Full-time",
      dept: "Marketing",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-6"
            >
              <Briefcase size={32} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900"
            >
              Bergabung dengan Tim
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Mari berkarya bersama membangun ekosistem digital kampus yang
              lebih baik.
            </motion.p>
          </div>

          {/* Positions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((job, index) => {
              const Icon = job.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{job.dept}</p>
                  <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Lihat Detail
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State / CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#2D3250] to-[#424769] rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">
              Tidak menemukan posisi yang cocok?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Kirimkan CV Anda ke database kami. Kami akan menghubungi jika ada
              posisi yang sesuai dengan kualifikasi Anda.
            </p>
            <button className="px-8 py-3 bg-white text-[#2D3250] rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Kirim CV
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
