"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { uploadImage, apiRequest } from "@/lib/utils/api";
import type { Category, CreateProductRequest, Product } from "@/types";

type ImagePreview = {
  file: File;
  url: string;
};

export const TambahBarangContent: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category_id: "",
    condition: "bekas baik" as const,
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await apiRequest<Category[]>("/categories");
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      // cleanup object URLs
      images.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [images]);

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
    const files = Array.from(e.target.files).slice(0, 6);

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter((f) => !validTypes.includes(f.type));

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Format Tidak Valid",
        text: "Hanya file JPG, PNG, dan WebP yang diperbolehkan",
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    const previews = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    // revoke old urls
    images.forEach((p) => URL.revokeObjectURL(p.url));
    setImages(previews);
    e.currentTarget.value = "";
  };

  const removeImage = (index: number) => {
    const toRemove = images[index];
    if (toRemove) URL.revokeObjectURL(toRemove.url);
    const next = images.filter((_, i) => i !== index);
    setImages(next);
  };

  const validate = () => {
    if (!formData.title.trim()) return "Nama barang wajib diisi";
    if (!formData.price.trim()) return "Harga wajib diisi";
    if (!formData.description.trim()) return "Deskripsi wajib diisi";
    if (!formData.category_id) return "Kategori wajib dipilih";
    if (images.length === 0) return "Minimal 1 gambar harus diupload";
    return null;
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
    const err = validate();
    if (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err,
        confirmButtonColor: "#2D3250",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload images
      const uploadedUrls: string[] = [];

      for (const img of images) {
        const result = await uploadImage(img.file);
        if (result.success && result.data) {
          uploadedUrls.push(result.data.url);
        } else {
          throw new Error(result.error || "Gagal upload gambar");
        }
      }

      // Step 2: Create product
      const productData: CreateProductRequest = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category_id: formData.category_id,
        condition: formData.condition,
        images: uploadedUrls,
      };

      const result = await apiRequest<Product>("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });

      if (result.success && result.data) {
        Swal.fire({
          title: "Berhasil!",
          text: "Produk berhasil ditambahkan. Silakan pilih paket listing untuk mengaktifkan produk.",
          icon: "success",
          confirmButtonColor: "#2D3250",
        }).then(() => {
          // Redirect to payment page
          router.push(`/payment/${result.data!.id}`);
        });
      } else {
        throw new Error(result.error || "Gagal membuat produk");
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan",
        confirmButtonColor: "#2D3250",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28 }}
      className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Tambah Barang
          </h2>
          <p className="text-sm text-gray-500">
            Isi detail lengkap agar pembeli lebih percaya.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Maks. 6 gambar • Format JPG/PNG
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: images & category */}
          <div className="md:col-span-1 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Gambar Produk *
            </label>

            <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-3 gap-3">
                {images.length > 0
                  ? images.map((p, idx) => (
                      <div
                        key={p.url}
                        className="relative rounded-md overflow-hidden bg-white"
                      >
                        <Image
                          src={p.url}
                          alt={`preview-${idx}`}
                          width={320}
                          height={240}
                          className="object-cover w-full h-28"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          aria-label="Hapus gambar"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  : [0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-md bg-gray-100 h-28 flex items-center justify-center text-sm text-gray-400"
                      >
                        Preview
                      </div>
                    ))}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm text-gray-700">Upload Gambar</span>
                </label>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="text-xs text-gray-400">
                  Rekomendasi: 800x800px
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 p-3 bg-white">
              <label className="block text-xs text-gray-500 mb-2">
                Kategori *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full rounded-md border-gray-200 bg-white text-sm px-3 py-2 text-gray-700"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-gray-100 p-3 bg-white">
              <label className="block text-xs text-gray-500 mb-2">
                Kondisi Barang *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-md border-gray-200 bg-white text-sm px-3 py-2 text-gray-700"
                required
              >
                <option value="baru">Baru</option>
                <option value="seperti baru">Seperti Baru</option>
                <option value="bekas baik">Bekas Baik</option>
                <option value="bekas">Bekas</option>
              </select>
            </div>
          </div>

          {/* Right: main fields */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Barang *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: MacBook Pro 2019"
                className="bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga *
              </label>
              <Input
                name="price"
                value={formatCurrency(formData.price)}
                onChange={handlePriceChange}
                placeholder="0"
                className="bg-white border-gray-200 text-gray-800 placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Masukkan angka tanpa titik/koma.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi & Detail *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tulis deskripsi singkat: kondisi, aksesoris, kelengkapan, dll."
                className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 min-h-[180px]"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-sm text-gray-500">
                Produk akan berstatus <strong>pending payment</strong> sampai
                Anda membayar biaya listing.
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: "",
                      price: "",
                      description: "",
                      category_id: "",
                      condition: "bekas baik",
                    });
                    images.forEach((p) => URL.revokeObjectURL(p.url));
                    setImages([]);
                  }}
                  className="px-4 py-2 rounded-full text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  className="px-6 py-2 rounded-full"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Tambah Barang"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
