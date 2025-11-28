"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/shared/Logo";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications?limit=1");
        const result = await response.json();
        if (result.success) {
          setUnreadCount(result.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user) {
      fetchUnreadCount();

      // Realtime subscription
      const supabase = createClient();
      const channel = supabase
        .channel("navbar-notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Increment count or refetch
            setUnreadCount((prev) => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

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
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    });

    if (result.isConfirmed) {
      await signOut();
      setMobileOpen(false);
      router.push("/");
    }
  };

  const menuItems = [
    { label: "Home", href: "/marketplace" },
    { label: "Bantuan", href: "/bantuan" },
    { label: "Notifikasi", href: "/notifikasi", badge: unreadCount },
    { label: "Profil", href: "/profil" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-200/80 backdrop-blur-sm shadow-md antialiased font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Logo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <div key={index} className="relative inline-flex items-center">
                  <Link
                    href={item.href}
                    className={`relative z-10 px-3 py-1.5 text-base font-semibold tracking-wide transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-800 hover:text-purple-700"
                    }`}
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    ) : null}
                  </Link>

                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-bg"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-md -z-10"
                    />
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1, scale: 1.02 }}
                      transition={{ duration: 0.16 }}
                      className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/5 -z-10"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-purple-300/20 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-purple-100 border-b border-purple-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-purple-500 text-white"
                        : "text-gray-800 hover:bg-purple-200/50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}

              {/* Mobile Logout Button */}
              {user && (
                <div className="pt-2 mt-2 border-t border-purple-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
