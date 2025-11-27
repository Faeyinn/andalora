"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/home/Footer";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Info,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "system" | "support" | "transaction";
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

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

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "support":
        return <MessageSquare className="text-blue-500" size={24} />;
      case "transaction":
        return <ShoppingBag className="text-green-500" size={24} />;
      default:
        return <Info className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#2D3250] hover:underline font-medium"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250] mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tidak ada notifikasi
                </h3>
                <p className="text-gray-500">
                  Anda akan melihat update penting di sini.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md flex gap-4 ${
                    notification.is_read
                      ? "bg-white border-gray-100"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.is_read ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3
                        className={`font-semibold ${
                          notification.is_read
                            ? "text-gray-900"
                            : "text-[#2D3250]"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {new Date(notification.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
