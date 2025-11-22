"use client";

import React from "react";
import { motion } from "framer-motion";

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "semua", label: "Semua", color: "bg-[#CBAF94]" },
    { id: "belum-dibaca", label: "Belum dibaca", color: "bg-[#8B9C8C]" },
    { id: "spam", label: "Spam", color: "bg-[#7C7687]" },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-full text-white font-medium transition-all ${
            activeTab === tab.id ? tab.color : "bg-gray-300"
          }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};