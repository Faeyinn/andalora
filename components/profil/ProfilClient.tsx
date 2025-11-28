"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Heart, Package, PlusCircle } from "lucide-react";
import { ProfileSidebar } from "@/components/profil/ProfileSidebar";
import { AkunContent } from "@/components/profil/AkunContent";
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
        return <AkunContent />;
      case "barang-saya":
        return <BarangSayaContent />;
      case "tambah-barang":
        return <TambahBarangContent />;
      default:
        return <AkunContent />;
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
                height:
                  "calc(100vh - var(--navbar-height) - var(--footer-height))",
                alignSelf: "start",
                overflowY: "auto",
              } as React.CSSProperties
            }
          >
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        <div className="lg:hidden sticky top-[calc(var(--navbar-height)+1rem)] z-30 mb-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-2">
            <div className="flex items-center justify-between relative">
              {[
                { id: "akun", label: "Akun", icon: User },
                { id: "favorit", label: "Favorit", icon: Heart },
                { id: "barang-saya", label: "Barang", icon: Package },
                { id: "tambah-barang", label: "Jual", icon: PlusCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-colors ${
                      isActive
                        ? "text-purple-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 bg-purple-50 rounded-xl"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      <Icon
                        size={20}
                        className={isActive ? "fill-current" : ""}
                      />
                    </span>
                    <span className="relative z-10 text-[10px] font-medium">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full">{renderContent()}</div>
      </div>
    </main>
  );
}
