import React from 'react';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';

export const HelpButton = () => {
  const handleHelp = () => {
    Swal.fire({
      title: 'Bantuan',
      html: `
        <div class="text-left">
          <p class="mb-3"><strong>Selamat datang di EduMarket!</strong></p>
          <p class="mb-2">• <strong>Log in as a guest:</strong> Akses marketplace tanpa registrasi</p>
          <p class="mb-2">• <strong>Log in:</strong> Masuk dengan akun terdaftar</p>
          <p class="mt-4 text-sm text-gray-600">Butuh bantuan lebih lanjut? Hubungi support kami.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#1f2937',
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
        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        Bantuan
      </motion.button>
    </motion.div>
  );
};
