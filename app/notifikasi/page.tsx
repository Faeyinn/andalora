"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { createClient } from "@/lib/supabase/client";
import Footer from "@/components/shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Info,
  MessageSquare,
  ShoppingBag,
  CheckCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Heart, Edit3, Trash2, PlusCircle } from "lucide-react";

import { Notification } from "@/types";

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Realtime subscription
      const supabase = createClient();
      const channel = supabase
        .channel("notifications-page")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setNotifications((prev) => [
                payload.new as Notification,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.new.id ? (payload.new as Notification) : n
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-purple-500/30">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-20 mt-20">
          <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Login Diperlukan
            </h2>
            <p className="text-gray-500 mb-8">
              Silahkan login terlebih dahulu untuk melihat notifikasi Anda.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#2D3250] text-white rounded-xl hover:bg-[#1f2337] transition-colors font-medium shadow-lg shadow-gray-200"
            >
              Login Sekarang
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?limit=50");
      const result = await response.json();
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      // Update local state
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    let targetLink = notification.link;

    // Fallback link generation if not provided in DB
    if (!targetLink && notification.related_product_id) {
      switch (notification.type) {
        case "product_created":
        case "product_updated":
          targetLink = `/marketplace/manage-product/${notification.related_product_id}`;
          break;
        case "product_favorited":
          targetLink = `/marketplace/product/${notification.related_product_id}`;
          break;
        case "product_sold":
        case "transaction":
          // Maybe to transaction detail? simpler to go to manage product for now
          targetLink = `/marketplace/manage-product/${notification.related_product_id}`;
          break;
        default:
          break;
      }
    }

    if (targetLink) {
      router.push(targetLink);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "support":
        return <MessageSquare className="text-blue-500" size={24} />;
      case "product_favorited":
        return <Heart className="text-pink-500" size={24} />;
      case "product_created":
        return <PlusCircle className="text-indigo-500" size={24} />;
      case "product_updated":
        return <Edit3 className="text-yellow-500" size={24} />;
      case "product_deleted":
      case "product_deleted_by_admin":
        return <Trash2 className="text-red-500" size={24} />;
      case "transaction":
      case "product_sold":
      case "payment_success":
        return <ShoppingBag className="text-green-500" size={24} />;
      case "payment_failed":
      case "listing_expired":
        return <Info className="text-red-500" size={24} />;
      case "listing_approved":
        return <CheckCheck className="text-teal-500" size={24} />;
      default:
        return <Info className="text-purple-500" size={24} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "support":
        return "bg-blue-100";
      case "product_favorited":
        return "bg-pink-100";
      case "product_created":
        return "bg-indigo-100";
      case "product_updated":
        return "bg-yellow-100";
      case "product_deleted":
      case "product_deleted_by_admin":
        return "bg-red-100";
      case "transaction":
      case "product_sold":
      case "payment_success":
        return "bg-green-100";
      case "payment_failed":
      case "listing_expired":
        return "bg-red-100";
      case "listing_approved":
        return "bg-teal-100";
      default:
        return "bg-purple-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifikasi
              </h1>
              <p className="text-gray-500">Update terbaru aktivitas Anda</p>
            </div>
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
              >
                <CheckCheck size={16} />
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Memuat notifikasi...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tidak ada notifikasi
                </h3>
                <p className="text-gray-500">
                  Anda akan melihat update penting di sini saat ada aktivitas
                  baru.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group relative p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${
                      notification.is_read
                        ? "bg-white border-gray-100"
                        : "bg-white border-purple-200 shadow-sm ring-1 ring-purple-100"
                    }`}
                  >
                    {!notification.is_read && (
                      <div className="absolute top-5 right-5 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-100" />
                    )}

                    <div className="flex gap-5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconBg(
                          notification.type
                        )}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-grow pr-8">
                        <div className="flex justify-between items-start mb-1">
                          <h3
                            className={`font-bold text-lg ${
                              notification.is_read
                                ? "text-gray-900"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-3">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                          <Clock size={14} />
                          {new Date(notification.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="text-gray-300" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
