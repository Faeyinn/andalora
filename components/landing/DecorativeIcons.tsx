"use client";

import React from "react";
import { Leaf, ShoppingCart, Recycle, Star, Zap } from "lucide-react";

export const DecorativeIcons = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute top-1/4 left-[10%] opacity-20 animate-float">
        <Recycle className="w-16 h-16 text-green-600" />
      </div>

      <div className="absolute bottom-1/4 right-[10%] opacity-20 animate-float animation-delay-2000">
        <Leaf className="w-20 h-20 text-green-500" />
      </div>

      <div className="absolute top-1/3 right-[15%] opacity-10 animate-float animation-delay-4000">
        <ShoppingCart className="w-12 h-12 text-purple-600" />
      </div>

      <div className="absolute bottom-1/3 left-[15%] opacity-15 animate-float animation-delay-2000">
        <Star className="w-10 h-10 text-yellow-500" />
      </div>

      <div className="absolute top-20 left-1/2 opacity-10 animate-float">
        <Zap className="w-8 h-8 text-blue-500" />
      </div>
    </div>
  );
};
