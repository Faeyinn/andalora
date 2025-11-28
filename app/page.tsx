"use client";

import React from "react";
import { DecorativeIcons } from "@/components/landing/DecorativeIcons";
import { HelpButton } from "@/components/landing/HelpButton";
import { Logo } from "@/components/landing/Logo";
import { MainCard } from "@/components/landing/MainCard";
import { BackgroundPattern } from "@/components/landing/BackgroundPattern";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <BackgroundPattern />

      {/* Decorative elements */}
      <DecorativeIcons />

      {/* Logo */}
      <Logo />

      {/* Help button */}
      <HelpButton />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <MainCard />
      </div>
    </div>
  );
}
