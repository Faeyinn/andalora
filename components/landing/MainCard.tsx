'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

export const MainCard = () => {
  const router = useRouter();

  const handleGuestLogin = async () => {
    const result = await Swal.fire({
      title: 'Masuk sebagai Tamu?',
      text: 'Anda akan mengakses marketplace dengan akses terbatas',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#1f2937',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      // Simulasi loading
      Swal.fire({
        title: 'Memuat...',
        text: 'Sedang mempersiapkan akses tamu',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulasi delay
      setTimeout(() => {
        Swal.close();
        router.push('/marketplace');
      }, 1500);
    }
  };

  return (
    <motion.div 
      className="bg-gray-200 rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full mx-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        <motion.h1 
          className="titan-one-regular text-4xl md:text-5xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ANDALORA
        </motion.h1>
        
        <motion.p 
          className="font-semibold italic text-gray-700 text-lg md:text-xl leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Andalas Re-Owner Assets
        </motion.p>

        <motion.p 
          className="font-semibold text-gray-700 text-lg md:text-xl leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Marketplace Mahasiswa Berbasis Web untuk Mendukung
          <br className="hidden sm:block" />
          Transaksi Barang Bekas dan Produk Usaha
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={handleGuestLogin}
            className="font-semibold bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl transition-all w-full sm:w-auto min-w-[250px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Log in as a guest
          </button>
          
          <Link href="/login">
            <button
              className="font-semibold bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl transition-all w-full sm:w-auto min-w-[250px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Log in
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};