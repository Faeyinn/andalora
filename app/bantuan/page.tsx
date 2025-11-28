"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Clock,
  ChevronRight,
  HelpCircle,
  FileText,
  Send,
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
    if (user) {
      fetchTickets();
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
              <HelpCircle className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Login Diperlukan
            </h2>
            <p className="text-gray-500 mb-8">
              Silahkan login terlebih dahulu untuk mengakses pusat bantuan dan
              tiket.
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
          timer: 2000,
          showConfirmButton: false,
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
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium border border-blue-200">
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium border border-yellow-200">
            In Progress
          </span>
        );
      case "closed":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-4"
            >
              <HelpCircle className="w-8 h-8 text-purple-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Pusat Bantuan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Kami siap membantu menyelesaikan masalah Anda. Buat tiket baru
              atau pantau status tiket Anda di sini.
            </motion.p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "list"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText size={18} />
                Tiket Saya
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "create"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Plus size={18} />
                Buat Tiket Baru
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-500">Memuat tiket...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-12 h-12 text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Belum ada tiket
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Anda belum pernah mengirimkan keluhan atau pertanyaan.
                      Jika ada masalah, jangan ragu untuk menghubungi kami.
                    </p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 font-medium"
                    >
                      <Plus size={20} />
                      Buat Tiket Pertama
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => router.push(`/bantuan/${ticket.id}`)}
                        className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {getStatusBadge(ticket.status)}
                              <span className="text-xs text-gray-400 font-mono">
                                #{ticket.id.slice(0, 8)}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {ticket.subject}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Clock size={16} className="text-gray-400" />
                                {new Date(ticket.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-3xl shadow-lg shadow-purple-500/5 border border-gray-100 p-8 md:p-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Sampaikan Keluhan
                    </h2>
                    <p className="text-gray-500">
                      Isi form di bawah ini untuk membuat tiket bantuan baru
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Subjek Masalah
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Contoh: Pembayaran Gagal"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Detail Pesan
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Jelaskan masalah Anda secara detail..."
                        rows={6}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none font-medium"
                        required
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab("list")}
                        className="flex-1 px-6 py-4 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={20} />
                            Kirim Tiket
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
