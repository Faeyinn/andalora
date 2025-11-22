import { Product } from "@/types";

// Daftar Unsplash image IDs yang sama dengan ProductGrid
const unsplashIds = [
  'photo-1523275335684-37898b6baf30',
  'photo-1491553895911-0055eca6402d',
  'photo-1461749280684-dccba630e2f6',
  'photo-1512436991641-6745cdb1723f',
  'photo-1503602642458-232111445657',
];

// Generate products array matching ProductGrid
export const products: Product[] = Array.from({ length: 16 }, (_, i) => {
  const id = (i + 1).toString();
  const imgId = unsplashIds[i % unsplashIds.length];
  const imageUrl = `https://images.unsplash.com/${imgId}?auto=format&fit=crop&w=800&q=80`;
  return {
    id,
    name: `Product ${id}`,
    seller: `Penjual ${String.fromCharCode(65 + (i % 8))}`, // A to H cycling
    price: 10.99 + (i % 5),
    description: 'This is a high-quality product designed to meet your everyday needs. Crafted with premium materials, it offers durability and style that stands out. Whether you\'re using it for personal or professional purposes, this item provides excellent performance and reliability. The sleek design ensures comfort and ease of use, making it a perfect addition to your collection. Available in various sizes and colors to suit different preferences.',
    imageUrl,
  };
});

// Function to get product by id
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Data untuk produk utama (fallback or example)
export const mainProduct: Product = products[0];

// Data untuk produk terkait (first 8 products)
export const relatedProducts: Product[] = products.slice(0, 8);
