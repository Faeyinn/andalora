'use client';

import React from 'react';
import { DecorativeIcons } from '@/components/landing/DecorativeIcons';
import { HelpButton } from '@/components/landing/HelpButton';
import { Logo } from '@/components/landing/Logo';
import { MainCard } from '@/components/landing/MainCard';
import { BackgroundPattern } from '@/components/landing/BackgroundPattern';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-green-50 via-white to-purple-50">
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
        <div className="w-full flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <MainCard />
        </div>
      </div>
    </div>
  );
}