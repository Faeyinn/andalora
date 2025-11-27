import { Navbar } from "@/components/shared/Navbar";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import Footer from "@/components/shared/Footer";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";

type ProductPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductPageParams) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product details
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      user:users(id, full_name, whatsapp, university),
      category:categories(id, name, slug)
    `
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    notFound();
  }

  // Fetch related products (same category, exclude current)
  const { data: related } = await supabase
    .from("products")
    .select(
      `
      *,
      user:users(id, full_name, whatsapp),
      category:categories(id, name, slug)
    `
    )
    .eq("category_id", product.category_id)
    .neq("id", id)
    .eq("status", "active")
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Konten Utama */}
      <main className="grow mt-20">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          {/* Bagian Detail Produk */}
          <div className="flex w-full flex-col lg:flex-row">
            <ProductImage
              imageUrl={product.images?.[0]}
              alt={product.title}
              productId={product.id}
            />
            <ProductInfo product={product as Product} />
          </div>

          {/* Bagian Produk Terkait */}
          {related && related.length > 0 && (
            <RelatedProducts products={related as Product[]} />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
