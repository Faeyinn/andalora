"use client"; // Komponen ini interaktif, jadi harus "use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Gunakan dari next/navigation di App Router
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/**
 * Komponen utama untuk formulir bantuan.
 */
const BantuanForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: 'Jane', // Dummy data
    telepon: 'Smitherton', // Dummy data
    email: 'email@janefakedomain.net', // Dummy data
    deskripsi: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Tampilkan SweetAlert2
    Swal.fire({
      title: 'Berhasil!',
      text: 'Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.',
      icon: 'success',
      confirmButtonColor: '#312B5F', // Sesuaikan warna tombol
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        // Arahkan pengguna ke halaman home (atau halaman lain)
        router.push('/');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl px-4 py-12 md:py-20"
    >
      {/* Sapaan dan Tombol Bantuan */}
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        Halo Guest!
      </h1>
      <Button variant="bantuan" size="sm" className="mb-10">
        Bantuan
      </Button>

      {/* Formulir Bantuan */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid untuk input atas */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <Input
              type="text"
              name="nama"
              id="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">
              Nomor telepon
            </label>
            <Input
              type="tel"
              name="telepon"
              id="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Textarea Deskripsi Masalah */}
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
            Deskripsi masalah
          </label>
          <Textarea
            name="deskripsi"
            id="deskripsi"
            rows={6}
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Enter your question or message"
            className="mt-1"
            required
          />
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default BantuanForm;