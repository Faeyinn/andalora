'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { HelpButton } from '@/components/auth/HelpButton';
import { Logo } from '@/components/shared/Logo';
import { IllustrationSection } from '@/components/auth/IllustrationSection';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex bg-linear-to-br from-gray-50 to-gray-100">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-10">
        <Logo />
      </div>
      
      {/* Help button */}
      <div className="absolute top-6 right-6 z-10">
        <HelpButton />
      </div>
      
      {/* Left section - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-6 md:p-12">
        <LoginForm />
      </div>

      {/* Right section - Illustration */}
      <IllustrationSection />
    </div>
  );
}