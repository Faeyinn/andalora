"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ProductImageProps = {
  imageUrl?: string;
  alt: string;
  productId?: number;
};

// Daftar Unsplash image IDs yang sama dengan ProductGrid
const unsplashIds = [
  'photo-1523275335684-37898b6baf30',
  'photo-1491553895911-0055eca6402d',
  'photo-1461749280684-dccba630e2f6',
  'photo-1512436991641-6745cdb1723f',
  'photo-1503602642458-232111445657',
];

export default function ProductImage({ imageUrl, alt, productId = 1 }: ProductImageProps) {
  // Jika tidak ada imageUrl, gunakan Unsplash berdasarkan productId
  const defaultImageId = unsplashIds[(productId - 1) % unsplashIds.length];
  const defaultImage = `https://images.unsplash.com/${defaultImageId}?auto=format&fit=crop&w=800&q=80`;
  const finalImageUrl = imageUrl || defaultImage;

  return (
    <motion.div
      className="w-full lg:w-1/2"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-100 shadow-lg">
        <Image
          src={finalImageUrl}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/800x600/f0f0f0/333?text=Image+Not+Found";
          }}
        />
      </div>
    </motion.div>
  );
}