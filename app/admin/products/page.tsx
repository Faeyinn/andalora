"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Product } from "@/types";
import { Search, Filter, Trash2, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        status: statusFilter,
      });
      const response = await fetch(`/api/admin/products?${params}`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
        setTotalPages(result.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProducts();

    // Realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("admin:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDeleteProduct = async (
    productId: string,
    productTitle: string
  ) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: `Apakah Anda yakin ingin menghapus produk "${productTitle}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/products?id=${productId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
          fetchProducts();
        } else {
          Swal.fire("Gagal!", data.error || "Gagal menghapus produk.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Terjadi kesalahan sistem.", "error");
      }
    }
  };

  const handleToggleStatus = async (
    productId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "active" ? "archived" : "active";
    const actionText = newStatus === "active" ? "Tampilkan" : "Sembunyikan";

    const result = await Swal.fire({
      title: `${actionText} Produk?`,
      text: `Produk akan ${
        newStatus === "active" ? "ditampilkan kembali" : "disembunyikan"
      } di marketplace.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2D3250",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Ya, ${actionText}`,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId, status: newStatus }),
        });
        const data = await response.json();

        if (data.success) {
          Swal.fire(
            "Berhasil!",
            `Produk berhasil ${
              newStatus === "active" ? "ditampilkan" : "disembunyikan"
            }.`,
            "success"
          );
          fetchProducts();
        } else {
          Swal.fire("Gagal!", data.error || "Gagal mengubah status.", "error");
        }
      } catch (error) {
        console.error("Update status error:", error);
        Swal.fire("Error!", "Terjadi kesalahan sistem.", "error");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      pending_payment: "bg-yellow-100 text-yellow-700",
      sold: "bg-blue-100 text-blue-700",
      expired: "bg-red-100 text-red-700",
      archived: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3250]"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3250] bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="sold">Sold</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Seller
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {product.user?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(product.id, product.status)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            product.status === "active"
                              ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={
                            product.status === "active"
                              ? "Sembunyikan"
                              : "Tampilkan"
                          }
                        >
                          {product.status === "active" ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product.id, product.title)
                          }
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
