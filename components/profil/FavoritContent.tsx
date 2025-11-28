"use client";

import React from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, ShoppingBag } from "lucide-react";

export const FavoritContent: React.FC = () => {
  const { favorites, loading, error, removeFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse mb-4" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="text-purple-600 fill-purple-600" />
          Favorit Saya
        </h2>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          {favorites.length} Produk
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Favorit
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Simpan produk yang Anda sukai untuk dilihat nanti. Mulai jelajahi
            marketplace sekarang!
          </p>
          <a
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg shadow-purple-500/30"
          >
            <ShoppingBag size={20} />
            Jelajahi Marketplace
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites
            .filter((favorite) => favorite.product && favorite.product.id)
            .map((favorite, index) => (
              <ProductCard
                key={favorite.id}
                product={favorite.product!}
                index={index}
              />
            ))}
        </div>
      )}
    </motion.div>
  );
};
