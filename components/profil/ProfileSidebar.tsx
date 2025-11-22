"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "akun", label: "Akun" },
    { id: "favorit", label: "Favorit" },
    { id: "barang-saya", label: "Barang Saya" },
    { id: "tambah-barang", label: "Tambah Barang" },
  ];

  return (
    // make h-full so it fills the sticky wrapper and can scroll internally if needed
    <div className="bg-white rounded-lg shadow-sm p-4 h-full max-h-[50vh] overflow-y-auto">
      <h2 className="text-2xl text-gray-800 font-bold mb-6">Halo Guest!</h2>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-full font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#CBAF94] text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};