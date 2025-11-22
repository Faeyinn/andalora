"use client";

import React from "react";
import { motion } from "framer-motion";

interface NotifikasiCardProps {
  title: string;
  description: string;
}

export const NotifikasiCard: React.FC<NotifikasiCardProps> = ({
  title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 px-6 py-5 flex items-start gap-4 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Icon/Avatar toko */}
      <div className="shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-700 shadow-sm">
        {title
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      {/* Content */}
      <div>
        <h3 className="text-lg md:text-xl text-gray-800 font-semibold mb-1">{title}</h3>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{description}</p>
      </div>
    </motion.div>
  );
};