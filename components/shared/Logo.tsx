import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Logo = () => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="flex items-center gap-2 group select-none">
        <span className="text-xl md:text-2xl tracking-tight">
          <span className="font-extrabold text-black">ANDA</span>
          <span className="font-normal text-gray-800">LORA</span>
        </span>
      </Link>
    </motion.div>
  );
};