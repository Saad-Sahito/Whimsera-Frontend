"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase/client";

export default function NavbarRightDashboard() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  let rippleCounter = 0;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const uniqueId = Date.now() + rippleCounter++;
    setRipples((prev) => [...prev, { id: uniqueId, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== uniqueId)), 1000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      onMouseMove={handleMouseMove}
      className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 py-1 shadow-md overflow-visible"
      style={{
        background:
          "linear-gradient(45deg, rgba(108,92,231,0.8) 0%, rgba(0,191,166,0.8) 100%)",
      }}
    >
      {/* 💫 Ripple Layer */}
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

      {/* 🌈 Brand */}
      <Link
        href="/dashboard"
        className="text-[96px] leading-none font-bold text-white relative z-10"
        style={{ fontFamily: "var(--font-annie)" }}
      >
        Whimsera
      </Link>

      {/* 🧭 Controls */}
      <div className="flex items-center space-x-6 relative z-10">
        {isAuthenticated && (
          <>
            <Link href="/start-story">
              <button className="px-4 py-1.5 rounded-md font-poppins font-bold text-[20px] bg-[#FFD166] text-[#2D3436] hover:bg-[#FF7675] hover:text-white transition">
                Start New Story
              </button>
            </Link>

            {/* 👤 Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-white text-4xl hover:text-[#FFD166] cursor-pointer select-none"
              >
                👤
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
