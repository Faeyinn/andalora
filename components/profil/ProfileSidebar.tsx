"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const tabs = [
    { id: "akun", label: "Akun" },
    { id: "favorit", label: "Favorit" },
    { id: "barang-saya", label: "Barang Saya" },
    { id: "tambah-barang", label: "Tambah Barang" },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2D3250",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      await signOut();

      Swal.fire({
        title: "Berhasil!",
        text: "Anda telah logout",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full max-h-[50vh] overflow-y-auto">
      <h2 className="text-2xl text-gray-800 font-bold mb-6">
        Halo {user?.full_name || "Guest"}!
      </h2>
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

        {/* Logout Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-full font-medium transition-colors bg-red-100 text-red-600 hover:bg-red-200 mt-4"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};
