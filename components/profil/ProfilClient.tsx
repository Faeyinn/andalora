"use client";

import React, { useState } from "react";
import { ProfileSidebar } from "@/components/profil/ProfileSidebar";
import { AkunForm } from "@/components/profil/AkunForm";
import { FavoritContent } from "@/components/profil/FavoritContent";
import { BarangSayaContent } from "@/components/profil/BarangSayaContent";
import { TambahBarangContent } from "@/components/profil/TambahBarangContent";

export default function ProfilClient() {
  const [activeTab, setActiveTab] = useState("akun");

  const renderContent = () => {
    switch (activeTab) {
      case "favorit":
        return <FavoritContent />;
      case "akun":
        return <AkunForm />;
      case "barang-saya":
        return <BarangSayaContent />;
      case "tambah-barang":
        return <TambahBarangContent />;
      default:
        return <AkunForm />;
    }
  };

  return (
    <main className="mt-15 w-full px-4 sm:px-6 lg:px-12 py-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-start">
        <div className="hidden lg:block">
          <div
            style={
              {
                position: "sticky",
                top: "var(--navbar-height)",
                height: "calc(100vh - var(--navbar-height) - var(--footer-height))",
                alignSelf: "start",
                overflowY: "auto",
              } as React.CSSProperties
            }
          >
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        <div className="lg:hidden bg-white rounded-lg shadow-sm p-3 mb-4">
          <h2 className="text-lg font-semibold mb-3">Halo Guest!</h2>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {["favorit", "akun", "barang-saya", "tambah-barang"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? "bg-[#CBAF94] text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {tab === "favorit" && "Favorit"}
                {tab === "akun" && "Akun"}
                {tab === "barang-saya" && "Barang Saya"}
                {tab === "tambah-barang" && "Tambah Barang"}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">{renderContent()}</div>
      </div>
    </main>
  );
}