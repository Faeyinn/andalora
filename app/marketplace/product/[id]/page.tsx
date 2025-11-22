import { Navbar } from "@/components/shared/Navbar";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import Footer from "@/components/shared/Footer";
import { getProductById, relatedProducts } from "@/lib/dummy-data";
import { notFound } from "next/navigation";

// Halaman ini bisa menjadi Server Component, karena data bisa di-fetch di sini
// dan komponen 'use client' bisa di-import.

type ProductPageParams = {
  params: {
    id: string;
  };
};

export default async function ProductDetailPage({ params }: ProductPageParams) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const related = relatedProducts;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Konten Utama */}
      <main className="grow mt-20">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          {/* Bagian Detail Produk */}
          <div className="flex w-full flex-col lg:flex-row">
            <ProductImage imageUrl={product.imageUrl} alt={product.name} />
            <ProductInfo product={product} />
          </div>

          {/* Bagian Produk Terkait */}
          <RelatedProducts products={related} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}