"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Edit, Trash2, CheckCircle, Clock, CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import { createClient } from "@/lib/supabase/client";

type OwnerControlsProps = {
  product: Product;
};

export default function OwnerControls({ product }: OwnerControlsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: "Produk yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
          router.push("/profil?tab=barang-saya");
          router.refresh();
        } else {
          const data = await response.json();
          throw new Error(data.error || "Gagal menghapus produk");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire(
          "Gagal",
          error.message || "Terjadi kesalahan saat menghapus produk",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "sold") {
      const result = await Swal.fire({
        title: "Tandai Terjual?",
        text: "Produk akan ditandai sebagai terjual dan tidak akan muncul di marketplace.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Ya, Tandai Terjual",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await Swal.fire("Berhasil", "Status produk diperbarui", "success");
        router.refresh();
      } else {
        throw new Error("Gagal memperbarui status");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan saat memperbarui status", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Kelola Produk</h3>

      {/* Status Indicator */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          {product.status === "active" && (
            <CheckCircle className="text-green-500" />
          )}
          {product.status === "pending_payment" && (
            <Clock className="text-orange-500" />
          )}
          {product.status === "sold" && (
            <CheckCircle className="text-gray-500" />
          )}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Status Saat Ini</span>
            <span className="font-semibold capitalize text-gray-900">
              {product.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Payment Action */}
      {product.status === "pending_payment" && (
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 space-y-3">
          <div className="flex items-start gap-3">
            <CreditCard className="text-orange-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-orange-900">
                Menunggu Pembayaran
              </h4>
              <p className="text-sm text-orange-700 mt-1">
                Selesaikan pembayaran untuk menayangkan produk ini di
                marketplace.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/payment/${product.id}`)}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors shadow-sm shadow-orange-200"
          >
            Lanjutkan Pembayaran
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            router.push(`/marketplace/manage-product/${product.id}/edit`)
          }
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Edit size={18} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
        >
          <Trash2 size={18} />
          Hapus
        </button>
      </div>

      {/* Status Toggles - Only show if NOT pending payment */}
      {product.status !== "pending_payment" && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Ubah Status</p>
          <div className="grid grid-cols-1 gap-2">
            {product.status !== "active" && (
              <button
                onClick={() => handleStatusChange("active")}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-left"
              >
                Set Aktif
              </button>
            )}
            {product.status !== "sold" && (
              <button
                onClick={() => handleStatusChange("sold")}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-left"
              >
                Tandai Terjual
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
