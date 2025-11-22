"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import TrueFocus from "@/components/anim/TrueFocus";
import RotatingText from "@/components/anim/RotatingText";

export const HeroSection = () => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(panelRef, { once: true, amount: 0.25 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  // Use numeric easing arrays (cubic bezier) instead of string names to satisfy framer-motion types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EASE_OUT: any = [0.22, 1, 0.36, 1];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EASE_IN_OUT: any = [0.42, 0, 0.58, 1];

  const panelVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.995 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: EASE_OUT,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const textItem = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  };

  return (
    <div
      className="relative h-[500px] flex items-center justify-center overflow-hidden"
      style={{ width: "100%", height: "600px", position: "relative" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/bg-dashboard-edmt.png)",
          transformOrigin: "center",
        }}
      />

      {/* subtle moving gradient overlays / parallax feel */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.18, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-linear-to-tr from-purple-600/6 via-pink-500/4 to-transparent pointer-events-none"
      />

      {/* floating soft orbs */}
      <motion.div
        aria-hidden
        className="absolute -left-16 -top-10 w-44 h-44 rounded-full bg-[#7C3AED]/20 blur-3xl pointer-events-none"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: EASE_IN_OUT }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-20 -bottom-6 w-56 h-56 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8.2, repeat: Infinity, ease: EASE_IN_OUT }}
      />

      <div className="relative z-10 px-4">
        <motion.div
          ref={panelRef}
          variants={panelVariants}
          initial="hidden"
          animate={controls}
          className="inline-block w-[720px] max-w-[90vw] bg-white/10 backdrop-blur-md backdrop-saturate-150 border border-white/20 rounded-2xl px-6 py-6 md:px-10 md:py-8 text-center overflow-hidden"
        >
          <motion.div variants={textItem}>
            <TrueFocus
              sentence="ANDALORA"
              manualMode={false}
              blurAmount={0}
              borderColor="purple"
              animationDuration={1}
              pauseBetweenAnimations={1}
            />
          </motion.div>

          {/* Animated rotating lines (purple) */}
          <div className="mt-4 flex items-center justify-center gap-4">
            {/* static white word */}
            <motion.span
              className="text-gray-800 text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-md"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.12 }}
            >
              Transaksi
            </motion.span>

            {/* RotatingText with subtle entrance + hover pop */}
            <motion.span
              className="inline-flex items-center"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.18 }}
              whileHover={{ scale: 1.02 }}
            >
              <RotatingText
                texts={["Barang Bekas", "Produk Usaha", "Aman antar mahasiswa"]}
                mainClassName="px-3 sm:px-4 md:px-5 bg-[#7C3AED] text-white font-extrabold text-lg md:text-xl lg:text-2xl overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-lg shadow-md"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2200}
              />
            </motion.span>
          </div>

          {/* subtle underline pulse */}
          <motion.div
            aria-hidden
            className="mt-4 h-1 w-24 mx-auto rounded-full bg-white/12"
            animate={{ scaleX: [0.8, 1.05, 0.9] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: EASE_IN_OUT }}
          />
        </motion.div>
      </div>
    </div>
  );
};
