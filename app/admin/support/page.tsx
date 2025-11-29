"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ChevronRight, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "normal" | "high";
  created_at: string;
  updated_at: string;
  user: {
    full_name: string;
    email: string;
  };
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();

    // Realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("admin-tickets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/support?status=${statusFilter}`);
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

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.includes(searchTerm)
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500">Manage user complaints and inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search subject, user, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3250] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={20} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D3250] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2D3250] mx-auto"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No tickets found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => router.push(`/admin/support/${ticket.id}`)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2D3250]">
                        {ticket.subject}
                      </h3>
                      {getStatusBadge(ticket.status)}
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          ticket.priority === "high"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : ticket.priority === "low"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-gray-50 text-gray-600 border-gray-100"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{ticket.user?.full_name || "Unknown User"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>
                          {new Date(ticket.updated_at).toLocaleDateString(
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
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        #{ticket.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="text-gray-300 group-hover:text-[#2D3250]" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
