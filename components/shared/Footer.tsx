"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const footerLinks = [
    {
      topic: "Marketplace",
      pages: ["Jual Barang", "Kategori", "Promo"],
    },
    {
      topic: "Bantuan",
      pages: ["FAQ", "Panduan Penjual", "Kontak"],
    },
    {
      topic: "Perusahaan",
      pages: ["Tentang Kami", "Karir", "Kebijakan"],
    },
  ];

  return (
    <footer className="w-full border-t border-gray-100 bg-white text-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: logo + description + socials */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-lg font-bold text-purple-700 shadow-sm">
                AL
              </div>
              <div>
                <h2 className="text-2xl font-semibold leading-snug text-gray-900">
                  ANDALORA
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Marketplace kampus — jual & beli antar mahasiswa dengan mudah.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition transform hover:scale-105"
                  >
                    <Icon className="h-5 w-5 text-gray-700" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: link groups */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {section.topic}
                </h3>
                <ul className="space-y-2">
                  {section.pages.map((page, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-sm text-gray-600 hover:text-gray-800 transition"
                      >
                        {page}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} EduMart. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link
              href="#"
              className="hover:text-gray-800 transition"
            >
              Syarat & Ketentuan
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href="#"
              className="hover:text-gray-800 transition"
            >
              Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}