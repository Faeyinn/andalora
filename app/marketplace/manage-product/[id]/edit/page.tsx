"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, Edit, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import { uploadImage, apiRequest } from "@/lib/utils/api";
import type { Category, Product } from "@/types";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

type ImagePreview = {
  file?: File;
  url: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category_id: "",
    condition: "bekas baik",
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch categories and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catResult = await apiRequest<Category[]>("/categories");
        if (catResult.success && catResult.data) {
          const allowedSlugs = [
            "elektronik",
            "fashion",
            "buku",
            "olahraga",
            "lainnya",
          ];
          const filtered = catResult.data.filter((cat) =>
            allowedSlugs.includes(cat.slug)
          );
          setCategories(filtered);
        }

        // Fetch product details
        const prodResult = await apiRequest<Product>(`/products/${id}`);
        if (prodResult.success && prodResult.data) {
          const p = prodResult.data;
          setFormData({
            title: p.title,
            price: p.price.toString(),
            description: p.description,
            category_id: p.category_id || "",
            condition: p.condition,
          });
          setImages(p.images.map((url) => ({ url })));
        } else {
          throw new Error("Gagal mengambil data produk");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Gagal memuat data produk", "error");
        router.push("/profil/barang-saya");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setFormData((s) => ({ ...s, price: raw }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 6 - images.length);

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter((f) => !validTypes.includes(f.type));

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Format Tidak Valid",
        text: "Hanya file JPG, PNG, dan WebP yang diperbolehkan",
      });
      return;
    }

    const previews = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));

    setImages((prev) => [...prev, ...previews]);
    e.currentTarget.value = "";
  };

  const removeImage = (index: number) => {
    const toRemove = images[index];
    if (toRemove.file) URL.revokeObjectURL(toRemove.url);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(value));
    } catch {
      return value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload new images
      for (const img of images) {
        if (img.file) {
          const result = await uploadImage(img.file);
          if (result.success && result.data) {
            uploadedUrls.push(result.data.url);
          } else {
            throw new Error("Gagal upload gambar");
          }
        } else {
          uploadedUrls.push(img.url); // Keep existing URL
        }
      }

      const updateData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category_id: formData.category_id,
        condition: formData.condition,
        images: uploadedUrls,
      };

      const result = await apiRequest(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (result.success) {
        await Swal.fire("Berhasil", "Produk berhasil diperbarui", "success");
        router.push(`/marketplace/manage-product/${id}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Gagal memperbarui produk");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan perubahan", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Edit className="text-purple-600" />
              Edit Barang
            </h2>
            <p className="text-gray-500 mt-1">
              Perbarui informasi barang Anda agar tetap relevan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Foto Produk
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200"
                  >
                    <Image
                      src={img.url}
                      alt={`Preview ${idx}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {images.length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group">
                    <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:bg-white group-hover:text-purple-600 transition-colors">
                      <Upload
                        size={24}
                        className="text-gray-400 group-hover:text-purple-600"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600">
                      Upload Foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <AlertCircle size={12} />
                Format: JPG, PNG, WebP. Maks 2MB per file.
              </p>
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detail Produk
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nama Barang
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Harga (Rp)
                  </label>
                  <Input
                    name="price"
                    value={formatCurrency(formData.price)}
                    onChange={handlePriceChange}
                    className="bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full rounded-md border-transparent bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Kondisi
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full rounded-md border-transparent bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="baru">Baru</option>
                    <option value="seperti baru">Seperti Baru</option>
                    <option value="bekas baik">Bekas Baik</option>
                    <option value="bekas">Bekas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Deskripsi Lengkap
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[150px] bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-lg font-medium shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
