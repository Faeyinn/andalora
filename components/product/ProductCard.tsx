"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

type ProductCardProps = {
  product: Product;
  index?: number;
  showStatus?: boolean;
};

export default function ProductCard({
  product,
  index = 0,
  showStatus = false,
}: ProductCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const router = useRouter();
  const isLiked = isFavorite(product.id);
  const isOwner = user?.id === product.user_id;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login Diperlukan",
        text: "Anda harus login untuk menambahkan ke favorit.",
        confirmButtonText: "Login",
        confirmButtonColor: "#2D3250",
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    if (isLiked) {
      const result = await removeFavorite(product.id);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Dihapus dari Favorit",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } else {
      const result = await addFavorite(product.id);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Ditambah ke Favorit",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.error || "Gagal menambahkan ke favorit",
        });
      }
    }
  };

  const getStatusBadge = () => {
    if (!showStatus) return null;

    const statusConfig = {
      active: { label: "Aktif", color: "bg-green-500" },
      pending_payment: { label: "Menunggu Pembayaran", color: "bg-orange-500" },
      sold: { label: "Terjual", color: "bg-gray-500" },
      expired: { label: "Kadaluarsa", color: "bg-red-500" },
      archived: { label: "Diarsipkan", color: "bg-gray-500" },
    };

    const config =
      statusConfig[product.status as keyof typeof statusConfig] ||
      statusConfig.active;

    return (
      <span
        className={`px-3 py-1 text-xs font-medium text-white ${config.color} backdrop-blur-md rounded-full border border-white/10 shadow-sm`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
    >
      <Link
        href={
          isOwner
            ? `/marketplace/manage-product/${product.id}`
            : `/marketplace/product/${product.id}`
        }
        className="block h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://placehold.co/800x600/f0f0f0/333?text=Image+Not+Found";
            }}
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full shadow-sm transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-white/90 text-gray-700 hover:bg-purple-600 hover:text-white"
              }`}
            >
              <Heart size={18} className={isLiked ? "fill-current" : ""} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
            {getStatusBadge()}
            <span className="px-3 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-md rounded-full border border-white/10">
              {product.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 line-clamp-1 text-lg group-hover:text-purple-700 transition-colors">
              {product.title}
            </h3>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
            {product.description}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Harga</span>
                <span className="text-lg font-bold text-gray-900">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {product.user?.avatar_url ? (
                  <Image
                    src={product.user.avatar_url}
                    alt={product.user.full_name}
                    width={24}
                    height={24}
                    className="rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                    {product.user?.full_name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs text-gray-500 font-medium truncate max-w-[80px]">
                  {product.user?.full_name || "Penjual"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
