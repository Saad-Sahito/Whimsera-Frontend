"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // import your Auth context
import { FaUserCircle } from "react-icons/fa"; // profile icon

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function Navbar() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let rippleCounter = 0;

  const { isAuthenticated } = useAuth(); // get auth state

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const uniqueId = Date.now() + rippleCounter++;
    setRipples((prev) => [...prev, { id: uniqueId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== uniqueId));
    }, 1000);
  };

  return (
    <nav
      onMouseMove={handleMouseMove}
      className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 py-1 shadow-md overflow-visible"
      style={{
        background:
          "linear-gradient(45deg, rgba(108,92,231,0.8) 0%, rgba(0,191,166,0.8) 100%)",
      }}
    >
      {/* Ripple container */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0.5, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: 50,
                height: 50,
                left: r.x - 20,
                top: r.y - 20,
                background:
                  "radial-gradient(circle, rgba(255,118,117,0.4) 0%, rgba(255,209,102,0.3) 70%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Left side - Whimsera brand */}
      <Link
        href="/"
        className="text-[96px] leading-none font-bold text-white relative z-10 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(44,62,80,0.8)]"
        style={{ fontFamily: "var(--font-annie)" }}
      >
        Whimsera
      </Link>

      {/* Right side buttons */}
      <div className="flex items-center space-x-6 relative z-10">
        <button className="text-white text-[20px] font-poppins font-bold border-b-2 border-transparent hover:border-[#FFD166] transition">
          Stories
        </button>
        <button className="text-white text-[20px] font-poppins font-bold border-b-2 border-transparent hover:border-[#FFD166] transition">
          Pricing
        </button>

        {/* Conditional rendering */}
        {!isAuthenticated ? (
          <Link href="/login">
            <button className="px-4 py-1.5 rounded-md font-poppins font-bold text-[20px] bg-[#FFD166] text-[#2D3436] hover:bg-[#FF7675] hover:text-white transition">
              Start For Free
            </button>
          </Link>
        ) : (
          <Link href="/dashboard">
            <FaUserCircle className="text-white text-4xl hover:text-[#FFD166] transition-colors cursor-pointer" />
          </Link>
        )}
      </div>
    </nav>
  );
}
