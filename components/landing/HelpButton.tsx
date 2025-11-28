import React from "react";
import { motion } from "motion/react";
import Swal from "sweetalert2";

export const HelpButton = () => {
  const handleHelp = () => {
    Swal.fire({
      title: "Bantuan Andalora",
      html: `
        <div class="text-left text-gray-600">
          <p class="mb-4"><strong>Selamat datang di Andalora!</strong></p>
          <p class="mb-3">Platform marketplace mahasiswa Universitas Andalas.</p>
          <div class="space-y-2 text-sm">
            <p>• <strong>Tamu:</strong> Jelajahi produk tanpa perlu akun.</p>
            <p>• <strong>Masuk:</strong> Akses fitur lengkap jual beli.</p>
          </div>
          <p class="mt-6 text-xs text-gray-400">Butuh bantuan? Hubungi support@andalora.com</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Mengerti",
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
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={handleHelp}
        className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Bantuan
      </motion.button>
    </motion.div>
  );
};
