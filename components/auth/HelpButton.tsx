'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

export const HelpButton = () => {
  const handleHelp = () => {
    Swal.fire({
      title: 'Bantuan',
      html: `
        <div class="text-left">
          <p class="mb-3"><strong>Butuh bantuan untuk login?</strong></p>
          <p class="mb-2">• Gunakan username dan password yang terdaftar</p>
          <p class="mb-2">• Atau login dengan akun Google Anda</p>
          <p class="mb-2">• Belum punya akun? Klik "Create an account"</p>
          <p class="mt-4 text-sm text-gray-600">Untuk demo, gunakan:</p>
          <p class="text-sm text-gray-600">Username: admin | Password: admin123</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#2D3250',
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