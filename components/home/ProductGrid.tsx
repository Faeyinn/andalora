"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

export const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const query = useMemo(
    () => ({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
    }),
    [selectedCategory, searchQuery]
  );

  const { products, loading, error } = useProducts(query);

  const categories = [
    { id: "", name: "Semua" },
    { id: "elektronik", name: "Elektronik" },
    { id: "fashion", name: "Fashion" },
    { id: "buku", name: "Buku" },
    { id: "olahraga", name: "Olahraga" },
    { id: "lainnya", name: "Lainnya" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Produk Terbaru
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan barang bekas berkualitas dari mahasiswa lainnya
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-[#2D3250] focus:outline-none transition-colors"
              suppressHydrationWarning
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-[#2D3250] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                suppressHydrationWarning
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2D3250]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#2D3250] text-white rounded-lg hover:bg-[#1f2337] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products?.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak Ada Produk
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory
                ? "Tidak ada produk yang sesuai dengan pencarian Anda"
                : "Belum ada produk yang tersedia"}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} {...product} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
