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
      user:users(id, full_name, whatsapp, university, avatar_url),
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
      user:users(id, full_name, whatsapp, avatar_url),
      category:categories(id, name, slug)
    `
    )
    .eq("category_id", product.category_id)
    .neq("id", id)
    .eq("status", "active")
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 selection:bg-purple-500/30">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb (Optional but good for UX) */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <a href="/marketplace" className="hover:text-purple-600">
              Marketplace
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </div>

          {/* Product Detail Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-20">
            <ProductImage images={product.images} title={product.title} />
            <ProductInfo product={product as Product} />
          </div>

          {/* Related Products Section */}
          {related && related.length > 0 && (
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Produk Serupa
              </h2>
              <RelatedProducts products={related as Product[]} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
