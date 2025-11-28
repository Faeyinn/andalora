import { Navbar } from "@/components/shared/Navbar";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import OwnerControls from "@/components/product/OwnerControls";
import Footer from "@/components/shared/Footer";
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";

type ProductPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ManageProductPage({ params }: ProductPageParams) {
  const { id } = await params;
  const adminSupabase = createAdminClient();
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch product details
  const { data: product, error } = await adminSupabase
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

  // Verify ownership
  if (product.user_id !== user.id) {
    redirect(`/marketplace/product/${id}`);
  }

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
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <a href="/profil/barang-saya" className="hover:text-purple-600">
              Barang Saya
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              Kelola: {product.title}
            </span>
          </div>

          {/* Product Detail Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-20">
            <ProductImage images={product.images} title={product.title} />

            <div className="w-full lg:w-2/5 lg:pl-12 space-y-8">
              {/* Standard Info (Read-only view for owner) */}
              <div>
                <ProductInfo product={product as Product} hideActions={true} />
              </div>

              {/* Owner Controls - Replaces standard actions */}
              <OwnerControls product={product as Product} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
