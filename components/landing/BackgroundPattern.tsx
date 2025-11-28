"use client";

import React from "react";

export const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-gray-50">
      {/* Animated Gradient Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-300/30 rounded-full blur-[100px] animate-blob" />

      <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-300/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />

      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-green-300/30 rounded-full blur-[100px] animate-blob animation-delay-4000" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};
