import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import BantuanForm from "@/components/bantuan/BantuanForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bantuan | EduMart",
  description: "Halaman bantuan untuk pengguna EduMart",
};

/**
 * Halaman Bantuan
 * Menyusun Navbar, BantuanForm, dan Footer.
 */
export default function HalamanBantuan() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Konten Utama */}
      <main className="grow mt-10">
        <BantuanForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}