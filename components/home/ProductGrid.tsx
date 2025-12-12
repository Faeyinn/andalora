"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../product/ProductCard"; // Fixed import path
import { useProducts } from "@/hooks/useProducts";
import { Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";

export const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header & Controls */}
        <div className="sticky top-20 z-30 mb-10 space-y-4 rounded-3xl bg-white/80 p-4 shadow-xl shadow-purple-500/5 backdrop-blur-xl border border-white/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari barang impianmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 outline-none ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 md:hidden"
            >
              <SlidersHorizontal size={20} />
              Filter
            </button>
          </div>

          {/* Categories */}
          <div
            className={`${
              isFilterOpen ? "block" : "hidden"
            } md:block overflow-x-auto pb-2 scrollbar-hide`}
          >
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {/* Loading State - Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
                <X size={40} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Gagal memuat produk
              </h3>
              <p className="mb-6 text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-200 blur-3xl opacity-20 rounded-full" />
                <ShoppingBag
                  size={80}
                  className="text-purple-300 relative z-10"
                />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Belum ada produk
              </h3>
              <p className="max-w-md text-gray-500">
                {searchQuery || selectedCategory
                  ? "Coba ubah kata kunci pencarian atau filter kategori untuk menemukan produk yang kamu cari."
                  : "Jadilah yang pertama menjual barang di sini!"}
              </p>
            </motion.div>
          )}

          {/* Product Grid */}
          {!loading && !error && products && products.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
