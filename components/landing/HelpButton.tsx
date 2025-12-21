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
          <p class="mb-3">Platform marketplace mahasiswa Universitas Andalas. Berikut ringkasan fitur dan panduan cepat:</p>
          <div class="space-y-2 text-sm">
            <p>• <strong>Untuk Pembeli:</strong> Cari dan filter produk, tambahkan ke favorit, dan lakukan pembelian melalui halaman produk.</p>
            <p>• <strong>Untuk Penjual:</strong> Gunakan menu "Tambah Barang" untuk membuat listing lengkap dengan foto, deskripsi, dan harga.</p>
            <p>• <strong>Lapor Masalah:</strong> Jika ada transaksi bermasalah, tandai pesanan dan hubungi tim support untuk bantuan lebih lanjut.</p>
          </div>
          <p class="mt-4 text-sm"><strong>Tips:</strong> Gunakan foto jelas, deskripsi lengkap, dan harga wajar untuk meningkatkan penjualan.</p>
          <p class="mt-6 text-xs text-gray-400">Butuh bantuan? Hubungi <a href="mailto:andalorasupp@gmail.com" class="text-blue-600 underline">andalorasupp@gmail.com</a></p>
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
