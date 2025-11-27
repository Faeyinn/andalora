"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, CheckCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: "bg-purple-500",
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Sold Products",
      value: stats.soldProducts,
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon
                  className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity or Charts could go here */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Welcome to Admin Panel
        </h2>
        <p className="text-gray-600">
          Select a menu item from the sidebar to manage users or products.
        </p>
      </div>
    </div>
  );
}
