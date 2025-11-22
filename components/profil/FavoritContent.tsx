// @/components/profil/FavoritContent.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/dummy-data";
import { ProductCard } from "@/components/home/ProductCard";

export const FavoritContent: React.FC = () => {
  const favoritProducts = products.slice(0, 12);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-transparent w-full"
    >
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Favorit</h2>

        {/* full-width grid, 3 kolom di md+ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {favoritProducts.map((product, index) => (
            <div key={product.id} className="w-full">
              <ProductCard {...product} index={index} hideCartButton />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};