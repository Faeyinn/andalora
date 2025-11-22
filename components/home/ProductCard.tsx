'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Swal from 'sweetalert2';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: string;
  index: number;
  hideCartButton?: boolean; // tambahkan prop opsional
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  index,
  hideCartButton = false, // default false
}) => {
  const router = useRouter();

  const handleAddToCart = () => {
    Swal.fire({
      title: 'Berhasil!',
      text: `${name} ditambahkan ke keranjang`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleProductClick = () => {
    router.push(`/marketplace/product/${id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleProductClick}
    >
      <div className="relative h-48 bg-gray-200">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-bold text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-xl font-bold">${price}</span>
          {!hideCartButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};