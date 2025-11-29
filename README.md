# Andalora (Andalas Re-Owner Assets) 🛍️

**Andalora** adalah platform marketplace khusus yang dirancang untuk mahasiswa Universitas Andalas. Platform ini memfasilitasi jual beli barang bekas (pre-loved) dan produk usaha mahasiswa dalam lingkungan yang aman, terpercaya, dan mudah digunakan.

![Banner Andalora](/public/bg-dashboard-edmt.png)

## 🌟 Fitur Utama

- **Autentikasi Pengguna**: Login dan registrasi yang aman menggunakan Supabase Auth.
- **Akses Berbasis Peran**: Antarmuka dan kemampuan yang berbeda untuk **Pengguna (User)** dan **Admin**.
- **Marketplace**:
  - Jelajahi dan cari produk dengan filter canggih.
  - Lihat informasi detail produk termasuk status verifikasi penjual.
  - Fitur "Hubungi Penjual" yang terintegrasi langsung dengan WhatsApp.
  - Simpan item ke favorit untuk akses cepat.
- **Manajemen Produk**:
  - Pengguna dapat menayangkan produk baru dengan gambar dan detail lengkap.
  - Kelola listing yang ada (Edit, Hapus, Sembunyikan/Tampilkan).
- **Dashboard Admin**:
  - Ringkasan komprehensif dengan grafik dan statistik.
  - Manajemen pengguna (Lihat, Penetapan Peran).
  - Moderasi produk.
  - Sistem tiket bantuan untuk menangani pertanyaan pengguna.
  - Pengaturan platform.
- **Notifikasi Real-time**: Pembaruan instan untuk transaksi, tiket bantuan, dan peringatan sistem.
- **Desain Responsif**: Dioptimalkan sepenuhnya untuk perangkat desktop, tablet, dan seluler.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (via Supabase)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Grafik**: [Recharts](https://recharts.org/)
- **Payment Gateway**: [Midtrans](https://midtrans.com/) (Siap integrasi)
- **Komponen UI**: Komponen kustom dengan [SweetAlert2](https://sweetalert2.github.io/) untuk modal.

## 📂 Struktur Proyek

```
andalora/
├── app/                # Halaman Next.js App Router dan rute API
│   ├── admin/          # Halaman dashboard admin
│   ├── api/            # Endpoint API backend
│   ├── login/          # Halaman autentikasi
│   ├── marketplace/    # Halaman utama marketplace
│   └── ...
├── components/         # Komponen UI yang dapat digunakan kembali
│   ├── admin/          # Komponen khusus admin
│   ├── auth/           # Formulir autentikasi
│   ├── home/           # Komponen halaman landing
│   ├── product/        # Komponen tampilan produk
│   └── shared/         # Komponen umum (Navbar, Footer, dll.)
├── contexts/           # Penyedia React Context (Auth, dll.)
├── lib/                # Fungsi utilitas dan konfigurasi
│   └── supabase/       # Pengaturan klien Supabase
├── public/             # Aset statis
├── types/              # Definisi tipe TypeScript
└── ...
```

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

---

Dibuat dengan ❤️ oleh Tim **ANDALORA**.
