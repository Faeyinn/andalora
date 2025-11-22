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
      <ProfilClient />

      <Footer />
    </div>
  );
}