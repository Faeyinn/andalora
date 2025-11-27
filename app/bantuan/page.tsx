"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/home/Footer";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "normal" | "high";
  created_at: string;
  updated_at: string;
}

export default function BantuanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchTickets();
    }
  }, [user, loading, router]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/support/tickets");
      const result = await response.json();
      if (result.success) {
        setTickets(result.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Tiket bantuan berhasil dibuat. Kami akan segera membalasnya.",
          icon: "success",
          confirmButtonColor: "#2D3250",
        });
        setSubject("");
        setMessage("");
        setActiveTab("list");
        fetchTickets();
      } else {
        Swal.fire({
          title: "Gagal!",
          text: result.error || "Gagal membuat tiket",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan sistem",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">
            In Progress
          </span>
        );
      case "closed":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pusat Bantuan
              </h1>
              <p className="text-gray-600 mt-2">
                Kami siap membantu masalah Anda
              </p>
            </div>
            <button
              onClick={() =>
                setActiveTab(activeTab === "list" ? "create" : "list")
              }
              className="flex items-center gap-2 bg-[#2D3250] text-white px-6 py-3 rounded-xl hover:bg-[#1f2337] transition-colors shadow-md"
            >
              {activeTab === "list" ? (
                <>
                  <Plus size={20} />
                  Buat Tiket Baru
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  Lihat Tiket Saya
                </>
              )}
            </button>
          </div>

          {activeTab === "list" ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250] mx-auto"></div>
                </div>
              ) : tickets.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Belum ada tiket
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Anda belum pernah mengirimkan keluhan atau pertanyaan.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="text-[#2D3250] font-medium hover:underline"
                  >
                    Buat tiket pertama Anda
                  </button>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => router.push(`/bantuan/${ticket.id}`)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2D3250] transition-colors">
                            {ticket.subject}
                          </h3>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(ticket.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span>ID: #{ticket.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-300 group-hover:text-[#2D3250] transition-colors" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Sampaikan Keluhan Anda
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek Masalah
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Pembayaran Gagal"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3250] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detail Pesan
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Jelaskan masalah Anda secara detail..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3250] focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("list")}
                    className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2D3250] text-white px-8 py-3 rounded-xl hover:bg-[#1f2337] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Tiket"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
