"use client";

import React from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export const HelpButton = () => {
  const handleHelp = () => {
    Swal.fire({
      title: "Bantuan Akses",
      html: `
        <div class="text-left text-gray-600">
          <p class="mb-4"><strong>Panduan Masuk & Daftar:</strong></p>
          <div class="space-y-2 text-sm">
            <p>• Gunakan <strong>email aktif</strong> universitas atau pribadi.</p>
            <p>• Password minimal 6 karakter.</p>
            <p>• Pastikan data diri sesuai KTM.</p>
          </div>
          <p class="mt-6 text-xs text-gray-400">Kendala login? Hubungi admin@andalora.com</p>
        </div>
      `,
      icon: "question",
      confirmButtonText: "Siap",
      confirmButtonColor: "#2D3250",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-6",
      },
    });
  };

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button
        onClick={handleHelp}
        className="bg-[#2D3250] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#1f2337] transition-colors"
      >
        Bantuan
      </button>
    </motion.div>
  );
};
