"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/home/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";

export const FavoritContent: React.FC = () => {
  const { favorites, loading, error, removeFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Favorit</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Favorit</h2>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-transparent w-full"
    >
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Favorit ({favorites.length})
        </h2>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Favorit
            </h3>
            <p className="text-gray-500">
              Produk yang Anda favoritkan akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {favorites
              .filter((favorite) => favorite.product && favorite.product.id)
              .map((favorite, index) => (
                <div key={favorite.id} className="w-full">
                  <ProductCard
                    {...favorite.product!}
                    index={index}
                    hideCartButton
                    onRemoveFavorite={() => removeFavorite(favorite.product_id)}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
