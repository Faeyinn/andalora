"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900"
            >
              Hubungi Kami
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mt-3"
            >
              Punya pertanyaan atau butuh bantuan? Tim support kami siap membantu Anda.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    icon: Mail,
                    key: "email",
                    title: "Email",
                    content: "andalorasupp@gmail.com",
                    desc: "Kirim email kapan saja",
                    href: "mailto:andalorasupp@gmail.com",
                  },
                  {
                    icon: Phone,
                    key: "whatsapp",
                    title: "WhatsApp",
                    content: "+62895600077007",
                    desc: "Senin - Jumat, 09:00 - 17:00",
                    href: "https://wa.me/62895600077007",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + index * 0.04 }}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-700 tracking-wide">{item.title}</h3>
                          {item.href ? (
                            <a href={item.href} className="text-gray-900 font-semibold mt-1 block hover:underline">{item.content}</a>
                          ) : (
                            <div className="text-gray-900 font-semibold mt-1">{item.content}</div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">{item.desc}</p>

                          {item.href && (
                            <div className="mt-4">
                              <a
                                href={item.href}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs shadow-sm"
                              >
                                Hubungi
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Lokasi Kantor</h3>
                <p className="text-sm text-gray-600 mt-2">Kampus Universitas Andalas — Limau Manis, Padang</p>
                <img
                  src="/map-placeholder.png"
                  alt="Map placeholder"
                  className="mt-4 w-full h-40 rounded-lg object-cover border border-gray-100"
                />
              </div>
            </div>

            <aside className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Jam Operasional</h4>
                    <div className="text-xs text-gray-500">Senin - Jumat, 09:00 - 17:00</div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <LinkIcon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Quick Links</h4>
                    <div className="flex flex-col text-sm mt-2 gap-2">
                      <Link href="/bantuan/faq" className="text-gray-600 hover:text-gray-900">Pusat Bantuan</Link>
                      <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">Marketplace</Link>
                      <Link href="/profil" className="text-gray-600 hover:text-gray-900">Profil Saya</Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 mb-2">FAQ Singkat</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <details className="bg-gray-50 p-3 rounded-md">
                    <summary className="cursor-pointer">Bagaimana cara lapor barang?</summary>
                    <div className="mt-2 text-xs text-gray-500">Gunakan tombol 'Laporkan' di halaman detail produk.</div>
                  </details>
                  <details className="bg-gray-50 p-3 rounded-md">
                    <summary className="cursor-pointer">Bagaimana cara membayar?</summary>
                    <div className="mt-2 text-xs text-gray-500">Pembayaran dilakukan melalui metode yang tersedia pada halaman checkout.</div>
                  </details>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
