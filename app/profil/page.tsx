import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProfilClient from "@/components/profil/ProfilClient";

export default function ProfilPage() {
  return (
    <div
      className="bg-white w-full"
      style={
        {
          "--navbar-height": "64px",
          "--footer-height": "96px",
        } as React.CSSProperties
      }
    >
      <Navbar />

      {/* client-side profile area */}
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
          </div>
        }
      >
        <ProfilClient />
      </React.Suspense>

      <Footer />
    </div>
  );
}
