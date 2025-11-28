"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, ShoppingCart, Recycle, Star, Zap } from "lucide-react";

export const DecorativeIcons = () => {
  const floatingAnimation = (delay: number) => ({
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: delay,
    },
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Icons */}
      <motion.div
        animate={floatingAnimation(0)}
        className="absolute top-1/4 left-[10%] opacity-20"
      >
        <Recycle className="w-16 h-16 text-green-600" />
      </motion.div>

      <motion.div
        animate={floatingAnimation(1)}
        className="absolute bottom-1/4 right-[10%] opacity-20"
      >
        <Leaf className="w-20 h-20 text-green-500" />
      </motion.div>

      <motion.div
        animate={floatingAnimation(2)}
        className="absolute top-1/3 right-[15%] opacity-10"
      >
        <ShoppingCart className="w-12 h-12 text-purple-600" />
      </motion.div>

      <motion.div
        animate={floatingAnimation(1.5)}
        className="absolute bottom-1/3 left-[15%] opacity-15"
      >
        <Star className="w-10 h-10 text-yellow-500" />
      </motion.div>

      <motion.div
        animate={floatingAnimation(0.5)}
        className="absolute top-20 left-1/2 opacity-10"
      >
        <Zap className="w-8 h-8 text-blue-500" />
      </motion.div>
    </div>
  );
};
