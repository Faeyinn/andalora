"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: ShoppingBag, label: "Products", href: "/admin/products" },
    { icon: MessageSquare, label: "Support", href: "/admin/support" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
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
    });

    if (result.isConfirmed) {
      await signOut();
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-[#2D3250] text-white min-h-screen fixed left-0 top-0 z-50 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wider">ANDALORA</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
