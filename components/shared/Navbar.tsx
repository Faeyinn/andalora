'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/marketplace' },
    { label: 'Bantuan', href: '/bantuan' },
    { label: 'Notifikasi', href: '/notifikasi' },
    { label: 'Profil', href: '/profil' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-200/80 backdrop-blur-sm shadow-md antialiased font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center h-full">
            <Logo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <div key={index} className="relative inline-flex items-center">
                  <Link
                    href={item.href}
                    className={`relative z-10 px-3 py-1.5 text-base font-semibold tracking-wide transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-800 hover:text-purple-700'
                    }`}
                  >
                    {item.label}
                  </Link>

                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-bg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-linear-to-r from-purple-500 to-purple-600 shadow-md -z-10"
                    />
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1, scale: 1.02 }}
                      transition={{ duration: 0.16 }}
                      className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/5 -z-10"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="text-black" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" className="text-black" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-purple-100 rounded-xl p-4 mt-2 shadow-md"
            >
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`block px-4 py-2 rounded-lg font-semibold text-base mb-1 transition-all ${
                      isActive
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-800 hover:bg-purple-300/40'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
