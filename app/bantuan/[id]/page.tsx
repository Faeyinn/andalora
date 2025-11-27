"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { createClient } from "@/lib/supabase/client";
import { Send, User, Shield, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

interface Message {
  id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  sender: {
    full_name: string;
  };
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`/api/support/tickets/${id}`);
        const result = await response.json();
        if (result.success) {
          setTicket(result.data.ticket);
          setMessages(result.data.messages);
        } else {
          Swal.fire("Error", result.error, "error");
          router.push("/bantuan");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTicketDetails();

      // Realtime subscription
      const supabase = createClient();
      const channel = supabase
        .channel(`ticket-${id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "support_messages",
            filter: `ticket_id=eq.${id}`,
          },
          async (payload) => {
            // Fetch the new message with sender details
            const { data: newMsg } = await supabase
              .from("support_messages")
              .select("*, sender:users(full_name)")
              .eq("id", payload.new.id)
              .single();

            if (newMsg) {
              setMessages((prev) => {
                // Avoid duplicates
                if (prev.find((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, loading, router, id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/support/tickets/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      const result = await response.json();

      if (result.success) {
        setNewMessage("");
        // Optimistically add message or refetch
        // For simplicity, refetch messages or append
        const newMsgObj: Message = {
          id: result.data.id,
          message: result.data.message,
          is_admin: false,
          created_at: new Date().toISOString(),
          sender: { full_name: user?.full_name || "Anda" },
        };
        setMessages([...messages, newMsgObj]);
      } else {
        Swal.fire("Gagal", result.error, "error");
      }
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
          {/* Header */}
          <div className="bg-white p-6 rounded-t-2xl border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/bantuan")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
                  {ticket?.subject}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-medium tracking-wide">
                    {ticket?.status}
                  </span>
                  <span>•</span>
                  <span>#{ticket?.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-grow bg-white overflow-y-auto p-6 space-y-6 bg-opacity-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.is_admin ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.is_admin ? "order-2" : "order-1"
                  }`}
                >
                  <div
                    className={`flex items-end gap-2 ${
                      msg.is_admin ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.is_admin
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {msg.is_admin ? <Shield size={14} /> : <User size={14} />}
                    </div>
                    <div
                      className={`p-4 rounded-2xl shadow-sm ${
                        msg.is_admin
                          ? "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                          : "bg-[#2D3250] text-white rounded-br-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-1 flex items-center gap-2 text-xs text-gray-400 ${
                      msg.is_admin ? "justify-start ml-10" : "justify-end mr-10"
                    }`}
                  >
                    <span>{msg.is_admin ? "Admin Support" : "Anda"}</span>
                    <span>•</span>
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 rounded-b-2xl border-t border-gray-100 shadow-sm">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan balasan..."
                className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3250] focus:border-transparent transition-all"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="bg-[#2D3250] text-white p-3 rounded-xl hover:bg-[#1f2337] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
