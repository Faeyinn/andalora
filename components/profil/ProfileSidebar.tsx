"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  User,
  Heart,
  Package,
  PlusCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

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
    { id: "akun", label: "Akun Saya", icon: User },
    { id: "favorit", label: "Favorit", icon: Heart },
    { id: "barang-saya", label: "Barang Saya", icon: Package },
    { id: "tambah-barang", label: "Jual Barang", icon: PlusCircle },
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
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await signOut();
      router.push("/");
    }
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        {/* User Mini Profile */}
        <div className="p-6 bg-gradient-to-br from-[#2D3250] to-[#424769] text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border border-white/30">
              {user?.full_name?.charAt(0) || "G"}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg truncate">
                {user?.full_name || "Guest"}
              </h2>
              <p className="text-xs text-gray-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                suppressHydrationWarning
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-50 text-purple-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={`transition-colors ${
                      isActive
                        ? "text-purple-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="font-medium">{tab.label}</span>
                </div>
                {isActive && (
                  <ChevronRight size={16} className="text-purple-600" />
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              suppressHydrationWarning
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
