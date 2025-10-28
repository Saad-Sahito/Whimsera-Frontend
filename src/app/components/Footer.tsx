"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function Footer() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let rippleCounter = 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate ripple size using clamp equivalent
    const clampValue = (min: number, val: number, max: number) => Math.min(Math.max(min, val), max);
    const vw = window.innerWidth * 0.05; // 5vw in pixels
    const rippleSize = clampValue(30, vw, 50); // clamp(30px, 5vw, 50px)

    const uniqueId = Date.now() + rippleCounter++;
    setRipples((prev) => [...prev, { id: uniqueId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== uniqueId));
    }, 1000);
  };

  return (
    <footer
      onMouseMove={handleMouseMove}
      className="relative w-full text-white py-4 sm:py-6 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(45deg, rgba(108,92,231,0.8) 0%, rgba(0,191,166,0.8) 100%)",
      }}
    >
      {/* Ripple effect layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {ripples.map((r) => {
            const clampValue = (min: number, val: number, max: number) => Math.min(Math.max(min, val), max);
            const vw = window.innerWidth * 0.05; // 5vw in pixels
            const rippleSize = clampValue(30, vw, 50); // clamp(30px, 5vw, 50px)
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0.5, scale: 0.6 }}
                animate={{ opacity: 0, scale: 2.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: `clamp(30px, 5vw, 50px)`,
                  height: `clamp(30px, 5vw, 50px)`,
                  left: r.x - rippleSize / 2,
                  top: r.y - rippleSize / 2,
                  background:
                    "radial-gradient(circle, rgba(255,118,117,0.4) 0%, rgba(255,209,102,0.3) 70%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Left side — social icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 sm:gap-6 relative z-10"
      >
        <button className="hover:scale-110 transition-transform">
          <Image
            src="/Icons8/upscayl_png_realesrgan-x4plus-anime_4x/icons8-instagram-100.png"
            alt="Instagram"
            width={16}
            height={16}
            className="sm:w-20 sm:h-20"
          />
        </button>
        <button className="hover:scale-110 transition-transform">
          <Image
            src="/Icons8/upscayl_png_realesrgan-x4plus-anime_4x/icons8-x-100.png"
            alt="X"
            width={16}
            height={16}
            className="sm:w-20 sm:h-20"
          />
        </button>
      </motion.div>

      {/* Right side — navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 sm:gap-6 relative z-10"
      >
        {/* ✅ Use Next.js Link for About page */}
        <Link
          href="/about"
          className="text-white text-sm sm:text-base md:text-lg font-poppins font-semibold border-b-2 border-transparent hover:border-[#FFD166] transition"
        >
          About
        </Link>

        <Link href="/feedback">
          <button className="bg-[#FFD166] text-[#2D3436] px-4 sm:px-5 py-1 sm:py-2 rounded-md font-poppins font-bold text-sm sm:text-base md:text-lg hover:bg-[#FF7675] hover:text-white transition">
            Give Feedback
          </button>
        </Link>
      </motion.div>

      {/* Bottom center — copyright */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs sm:text-sm text-white/80 font-nunito">
        © {new Date().getFullYear()} Whimsera (Beta Version). All rights reserved.
      </div>
    </footer>
  );
}