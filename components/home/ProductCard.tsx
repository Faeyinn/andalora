"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { Product, ProductStatus } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { getWhatsAppLink } from "@/lib/utils/format";

interface ProductCardProps extends Omit<Partial<Product>, "user"> {
  id: string;
  title?: string;
  name?: string;
  description: string;
  price: number;
  images?: string[];
  imageUrl?: string;
  seller?: string;
  status?: ProductStatus;
  index: number;
  hideCartButton?: boolean;
  showStatus?: boolean;
  onRemoveFavorite?: () => void;
  user?: {
    whatsapp: string;
    full_name: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  name,
  description,
  price,
  images,
  imageUrl,
  status,
  index,
  hideCartButton = false,
  showStatus = false,
  onRemoveFavorite,
  user,
}) => {
  const productName = title || name || "Produk";
  const productImage = imageUrl || (images && images[0]) || "/placeholder.jpg";
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);

  const isFav = isFavorite(id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingFavorite(true);

    try {
      if (isFav) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
    } finally {
      setIsAddingFavorite(false);
    }
  };

  const handleWhatsApp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.whatsapp) {
      // Notify seller via API (fire and forget)
      fetch(`/api/products/${id}/contact`, { method: "POST" }).catch((err) =>
        console.error("Failed to notify seller:", err)
      );

      const message = `Halo, saya tertarik dengan produk "${productName}" seharga Rp ${price.toLocaleString(
        "id-ID"
      )}`;
      const whatsappUrl = getWhatsAppLink(user.whatsapp, message);
      window.open(whatsappUrl, "_blank");
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const statusConfig = {
      pending_payment: { label: "Menunggu Pembayaran", color: "bg-yellow-500" },
      active: { label: "Aktif", color: "bg-green-500" },
      expired: { label: "Kadaluarsa", color: "bg-red-500" },
      sold: { label: "Terjual", color: "bg-blue-500" },
    };
    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-500",
    };
    return (
      <span
        className={`absolute top-2 right-2 ${config.color} text-white text-xs px-2 py-1 rounded-full z-10`}
      >
        {config.label}
      </span>
    );
  };

  const handleProductClick = () => {
    router.push(`/marketplace/product/${id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleProductClick}
    >
      <div className="relative h-48 bg-gray-200">
        {showStatus && status && getStatusBadge(status)}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isAddingFavorite}
          className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
            isFav
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-700 hover:bg-white"
          } disabled:opacity-50`}
        >
          <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
        </button>

        <Image
          src={productImage}
          alt={productName}
          fill
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h3 className="text-gray-800 font-bold text-lg mb-2">{productName}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 text-xl font-bold">
            Rp {price.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* WhatsApp Button */}
          {user?.whatsapp && !hideCartButton && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Hubungi</span>
            </button>
          )}

          {/* Remove Favorite Button (for favorite page) */}
          {onRemoveFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              title="Hapus dari favorit"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
