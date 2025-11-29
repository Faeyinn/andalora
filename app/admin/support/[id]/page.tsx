"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, User, Shield, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { createClient } from "@/lib/supabase/client";

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
  user: {
    full_name: string;
    email: string;
  };
}

export default function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTicketDetails();

    // Realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`admin-ticket-${id}`)
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
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch(`/api/support/tickets/${id}`);
      const result = await response.json();
      if (result.success) {
        setTicket(result.data.ticket);
        setMessages(result.data.messages);
      } else {
        Swal.fire("Error", result.error, "error");
        router.push("/admin/support");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setIsLoading(false);
    }
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
        // Optimistically add message
        const newMsgObj: Message = {
          id: result.data.id,
          message: result.data.message,
          is_admin: true,
          created_at: new Date().toISOString(),
          sender: { full_name: "Admin Support" },
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

  // Note: Functionality to close ticket or change status could be added here
  // For now, we'll just focus on messaging.

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/support")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">
              {ticket?.subject}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User size={14} />
                {ticket?.user?.full_name}
              </span>
              <span className="text-gray-300">•</span>
              <span
                className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wide ${
                  ticket?.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ticket?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] ${
                msg.is_admin ? "order-1" : "order-2"
              }`}
            >
              <div
                className={`flex items-end gap-2 ${
                  msg.is_admin ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.is_admin
                      ? "bg-[#2D3250] text-white"
                      : "bg-white border border-gray-200 text-gray-600"
                  }`}
                >
                  {msg.is_admin ? <Shield size={14} /> : <User size={14} />}
                </div>
                <div
                  className={`p-4 shadow-sm ${
                    msg.is_admin
                      ? "bg-[#2D3250] text-white rounded-2xl rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
              <div
                className={`mt-1.5 flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wide ${
                  msg.is_admin ? "justify-end mr-10" : "justify-start ml-10"
                }`}
              >
                <span>{msg.is_admin ? "You" : msg.sender.full_name}</span>
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
      <div className="bg-white p-4 border-t border-gray-100">
        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 max-w-4xl mx-auto items-end"
        >
          <div className="flex-grow relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your reply..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3250] focus:border-transparent transition-all resize-none min-h-[46px] max-h-32"
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-[#2D3250] text-white p-3 rounded-xl hover:bg-[#1f2337] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-[46px] w-[46px] flex items-center justify-center"
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
  );
}
