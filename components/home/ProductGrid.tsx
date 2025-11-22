'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { products } from '@/lib/dummy-data';

interface ProductGridProps {
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery,
  minPrice,
  maxPrice,
}) => {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = (searchQuery.trim() === '') ||
      (product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;

    const matchesMinPrice = min === null || product.price >= min;
    const matchesMaxPrice = max === null || product.price <= max;

    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="w-full px-2 sm:px-4 py-8 sm:py-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Belanja Apa Hari Ini?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard key={product.id} {...product} index={index} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">Tidak ada produk yang sesuai dengan filter.</p>
      )}
    </div>
  );
};
