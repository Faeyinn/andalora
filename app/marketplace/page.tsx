"use client";

import { Navbar } from "@/components/shared/Navbar";
import { MarketplaceHeroSection } from "@/components/marketplace/MarketplaceHeroSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Footer } from "@/components/home/Footer";
import { motion } from "framer-motion";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 selection:bg-purple-500/30">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 pt-16">
        <MarketplaceHeroSection />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          id="product-grid"
        >
          {/* Decorative Divider */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />

          <ProductGrid />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
