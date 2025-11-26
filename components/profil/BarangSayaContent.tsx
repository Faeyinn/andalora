"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/home/ProductCard";
import { useMyProducts } from "@/hooks/useProducts";

export const BarangSayaContent: React.FC = () => {
  const { products, loading, error, refetch } = useMyProducts();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Barang Saya
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Barang Saya
        </h2>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#2D3250] text-white rounded-lg hover:bg-[#1f2337] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Group products by status
  const pendingPayment = products.filter((p) => p.status === "pending_payment");
  const active = products.filter((p) => p.status === "active");
  const expired = products.filter((p) => p.status === "expired");
  const sold = products.filter((p) => p.status === "sold");

  const renderProductSection = (
    title: string,
    items: typeof products,
    statusColor: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
          {title} ({items.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((product, index) => (
            <div key={product.id} className="w-full">
              <ProductCard
                {...product}
                index={index}
                hideCartButton
                showStatus
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-transparent w-full"
    >
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Barang Saya ({products.length})
          </h2>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>

        {products.length === 0 ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Barang
            </h3>
            <p className="text-gray-500 mb-4">
              Anda belum menambahkan barang untuk dijual
            </p>
          </div>
        ) : (
          <div>
            {renderProductSection(
              "Menunggu Pembayaran",
              pendingPayment,
              "bg-yellow-500"
            )}
            {renderProductSection("Aktif", active, "bg-green-500")}
            {renderProductSection("Kadaluarsa", expired, "bg-red-500")}
            {renderProductSection("Terjual", sold, "bg-blue-500")}
          </div>
        )}
      </div>
    </motion.div>
  );
};
