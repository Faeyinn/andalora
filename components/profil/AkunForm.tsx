"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export const AkunForm: React.FC = () => {
  const [formData, setFormData] = useState({
    namaPengguna: "",
    email: "",
    nim: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.namaPengguna.trim()) return "Nama Pengguna wajib diisi.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
      return "Masukkan email valid.";
    if (!formData.nim.trim()) return "NIM wajib diisi.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      Swal.fire({ icon: "error", title: "Error", text: err, confirmButtonColor: "#312B5F" });
      return;
    }

    setLoading(true);
    try {
      // simulate save
      await new Promise((r) => setTimeout(r, 700));
      Swal.fire({
        title: "Berhasil",
        text: "Pengaturan akun disimpan.",
        icon: "success",
        confirmButtonColor: "#312B5F",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Gagal", text: "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="w-full bg-white rounded-2xl shadow-lg p-8 sm:p-10 sm:pr-12 sm:pb-28 min-h-[720px]"
    >
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Pengaturan Akun</h2>
          <p className="text-sm text-gray-500 mt-1">
            Perbarui informasi profil dan keamanan Anda. Data ini hanya terlihat oleh Anda.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg font-semibold text-purple-700 border border-gray-100 overflow-hidden">
              G
            </div>
            <div className="text-sm text-right">
              <div className="font-medium text-gray-800">Guest</div>
              <div className="text-xs text-gray-500">Member sejak 2024</div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center md:items-start gap-6">
            <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
              <Image
                src="https://images.unsplash.com/illustration-people-avatar?auto=format&fit=crop&w=400&q=80"
                alt="avatar ilustrasi"
                width={144}
                height={144}
                className="object-cover rounded-full"
                unoptimized
              />
            </div>

            <label className="text-sm text-gray-600">Ubah foto profil</label>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-gray-500 w-full md:w-auto file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
            />

            <div className="text-xs text-gray-500 mt-2 text-center md:text-left">
              Tip: Gunakan foto persegi (min 200x200) agar tampil optimal.
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pengguna</label>
                <Input
                  type="text"
                  name="namaPengguna"
                  placeholder="Nama lengkap"
                  value={formData.namaPengguna}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 py-3"
                  aria-label="Nama Pengguna"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
                <Input
                  type="text"
                  name="nim"
                  placeholder="xxxxxx"
                  value={formData.nim}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 py-3"
                  aria-label="NIM"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="nama@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 py-3"
                  aria-label="Email"
                />
                <p className="text-xs text-gray-400 mt-1">Gunakan email aktif untuk pemulihan akun.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 py-3"
                  aria-label="Password"
                />
                <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti password.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100"></div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Keamanan: gunakan password yang kuat & jangan bagikan pada orang lain.
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setFormData({ namaPengguna: "", email: "", nim: "", password: "" })}
                  className="px-4 py-2 rounded-full text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  Reset
                </Button>

                <Button type="submit" className="px-6 py-3 rounded-full" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              Catatan: Setelah menyimpan, perubahan dapat memakan waktu beberapa menit untuk terlihat di seluruh layanan.
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};