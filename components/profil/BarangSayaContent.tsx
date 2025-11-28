"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { useMyProducts } from "@/hooks/useProducts";
import { Package, RefreshCw, Plus } from "lucide-react";

export const BarangSayaContent: React.FC = () => {
  const { products, loading, error, refetch } = useMyProducts();
  const [activeStatus, setActiveStatus] = useState<string>("all");

  const tabs = [
    { id: "all", label: "Semua" },
    { id: "active", label: "Aktif" },
    { id: "pending_payment", label: "Menunggu Pembayaran" },
    { id: "sold", label: "Terjual" },
  ];

  const filteredProducts =
    activeStatus === "all"
      ? products
      : products.filter((p) => p.status === activeStatus);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="text-purple-600" />
          Barang Saya
        </h2>
        <button
          onClick={() => refetch()}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeStatus === tab.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Tidak ada barang ditemukan
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            {activeStatus === "all"
              ? "Anda belum menambahkan barang untuk dijual."
              : `Tidak ada barang dengan status "${
                  tabs.find((t) => t.id === activeStatus)?.label
                }".`}
          </p>
          {activeStatus === "all" && (
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg shadow-purple-500/30">
              <Plus size={20} />
              Jual Barang Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
