"use client";

import { motion } from "framer-motion";
import { Heart, Flag, Share2, MessageCircle, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { Product } from "@/types";
import Image from "next/image";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

type ProductInfoProps = {
  product: Product;
  hideActions?: boolean;
};

export default function ProductInfo({
  product,
  hideActions = false,
}: ProductInfoProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isLiked = isFavorite(product.id);

  const handleContact = () => {
    Swal.fire({
      title: "Hubungi Penjual",
      text: "Anda akan diarahkan ke WhatsApp penjual.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // WhatsApp Green
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Buka WhatsApp",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Create notification for seller
        if (user) {
          fetch("/api/notifications/contact-seller", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: product.id }),
          }).catch((err) => console.error("Failed to notify seller:", err));
        }

        if (product.user?.whatsapp) {
          const message = `Halo, saya tertarik dengan produk "${
            product.title
          }" seharga Rp ${product.price.toLocaleString("id-ID")}`;
          const whatsappUrl = `https://wa.me/${
            product.user.whatsapp
          }?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        } else {
          Swal.fire("Info", "Nomor WhatsApp penjual tidak tersedia", "info");
        }
      }
    });
  };

  const toggleFavorite = async () => {
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
          title: "Dihapus dari Favorit",
          icon: "success",
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
          title: "Ditambah ke Favorit",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.error || "Gagal menambahkan ke favorit",
          icon: "error",
        });
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      title: "Link Disalin!",
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="sticky top-24 space-y-6">
        {/* Header Info */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 uppercase tracking-wide">
              {product.condition}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="Bagikan"
              >
                <Share2 size={18} />
              </button>
              {!hideActions && (
                <button
                  onClick={() => {}}
                  className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Laporkan"
                >
                  <Flag size={18} />
                </button>
              )}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Seller Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 shrink-0">
            {product.user?.avatar_url ? (
              <Image
                src={product.user.avatar_url}
                alt={product.user.full_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-100 text-purple-600 font-bold text-lg">
                {product.user?.full_name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-gray-900 truncate">
                {product.user?.full_name || "Penjual"}
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full shrink-0">
                <ShieldCheck size={12} />
                Verified
              </div>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {product.user?.university || "Mahasiswa"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm text-gray-600 max-w-none">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Deskripsi Produk
          </h3>
          <p className="whitespace-pre-line leading-relaxed text-gray-600">
            {product.description}
          </p>
        </div>

        {/* Action Buttons */}
        {!hideActions && (
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleContact}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle size={20} />
              Chat Penjual
            </button>

            <button
              onClick={toggleFavorite}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 px-8 py-3.5 font-semibold transition-all ${
                isLiked
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Heart size={20} className={isLiked ? "fill-red-500" : ""} />
              {isLiked ? "Disimpan" : "Simpan ke Favorit"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
