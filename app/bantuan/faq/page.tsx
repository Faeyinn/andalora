"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "Bagaimana cara menjual barang?",
      answer:
        "Untuk menjual barang, Anda perlu mendaftar akun terlebih dahulu. Setelah login, klik tombol 'Jual Barang' di pojok kanan atas atau melalui menu profil. Isi detail produk, upload foto, dan tentukan harga.",
    },
    {
      question: "Apakah ada biaya administrasi?",
      answer:
        "Saat ini Andalora tidak membebankan biaya administrasi untuk penjual. Semua hasil penjualan 100% milik Anda.",
    },
    {
      question: "Bagaimana sistem pembayarannya?",
      answer:
        "Pembeli dapat membayar menggunakan berbagai metode pembayaran yang tersedia (Transfer Bank, E-Wallet). Dana akan ditahan oleh Andalora dan diteruskan ke penjual setelah pembeli mengonfirmasi penerimaan barang.",
    },
    {
      question: "Apakah aman bertransaksi di Andalora?",
      answer:
        "Ya, kami menggunakan sistem Rekening Bersama (Rekber) untuk menjamin keamanan transaksi. Uang pembeli aman sampai barang diterima.",
    },
    {
      question: "Bagaimana jika barang tidak sesuai?",
      answer:
        "Pembeli dapat mengajukan komplain jika barang yang diterima tidak sesuai deskripsi. Tim support kami akan membantu memediasi masalah tersebut.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-6"
            >
              <HelpCircle size={32} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900"
            >
              Pertanyaan Umum
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              Temukan jawaban untuk pertanyaan yang sering diajukan.
            </motion.p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FAQItem({
  faq,
  index,
}: {
  faq: { question: string; answer: string };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{faq.question}</span>
        <ChevronDown
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
