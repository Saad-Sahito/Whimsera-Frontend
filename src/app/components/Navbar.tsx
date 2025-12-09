"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function Navbar() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let rippleCounter = 0;

  const { isAuthenticated } = useAuth();

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampValue = (min: number, val: number, max: number) =>
      Math.min(Math.max(min, val), max);
    const vw = window.innerWidth * 0.05;
    const rippleSize = clampValue(30, vw, 50);

    const uniqueId = Date.now() + rippleCounter++;
    setRipples((prev) => [...prev, { id: uniqueId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== uniqueId));
    }, 1000);
  };

  return (
    <nav
      onMouseMove={handleMouseMove}
      className="fixed top-0 left-0 z-50 w-full flex flex-wrap justify-between items-center px-4 sm:px-6 py-2 sm:py-3 shadow-md overflow-visible"
      style={{
        background:
          "linear-gradient(45deg, rgba(108,92,231,0.8) 0%, rgba(0,191,166,0.8) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Ripple container */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {ripples.map((r) => {
            const clampValue = (min: number, val: number, max: number) =>
              Math.min(Math.max(min, val), max);
            const vw = window.innerWidth * 0.05;
            const rippleSize = clampValue(30, vw, 50);
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

      {/* Left side - Whimsera brand */}
      <Link
        href="/"
        className="text-4xl sm:text-5xl md:text-6xl leading-none font-bold text-white relative z-10 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(44,62,80,0.8)]"
        style={{ fontFamily: "var(--font-annie)" }}
      >
        Whimsera
      </Link>

      {/* Right side buttons */}
      <div className="flex flex-wrap items-center space-x-3 sm:space-x-4 md:space-x-6 relative z-10">
        <button className="text-white text-sm sm:text-base md:text-lg font-poppins font-bold border-b-2 border-transparent hover:border-[#FFD166] transition">
          Stories
        </button>

        {/* Pricing link always visible as text button */}
        <Link href="/pricing">
          <button className="text-white text-sm sm:text-base md:text-lg font-poppins font-bold border-b-2 border-transparent hover:border-[#FFD166] transition">
            Pricing
          </button>
        </Link>

        <Link href="/feedback">
          <button className="text-white text-sm sm:text-base md:text-lg font-poppins font-bold border-b-2 border-transparent hover:border-[#FFD166] transition">
            Give Feedback
          </button>
        </Link>

        {/* Conditional rendering */}
        {!isAuthenticated ? (
          <>
            {/* Extra prominent Pricing button only for unauthenticated users */}
            <Link href="/pricing">
              <button className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-poppins font-bold text-sm sm:text-base bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:border-[#FFD166] transition">
                Pricing
              </button>
            </Link>

            <Link href="/login">
              <button className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-poppins font-bold text-sm sm:text-base bg-[#FFD166] text-[#2D3436] hover:bg-[#FF7675] hover:text-white transition">
                Start For Free
              </button>
            </Link>
          </>
        ) : (
          <Link href="/dashboard">
            <FaUserCircle className="text-white text-2xl sm:text-3xl md:text-4xl hover:text-[#FFD166] transition-colors cursor-pointer" />
          </Link>
        )}
      </div>
    </nav>
  );
}