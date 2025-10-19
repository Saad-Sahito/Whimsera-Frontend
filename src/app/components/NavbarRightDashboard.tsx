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
  const { isAuthenticated, accessToken } = useAuth();
  const router = useRouter();
  let rippleCounter = 0;

  const handleLogout = async () => {
    try {
      // Get the user ID from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Failed to get user ID: " + (userError?.message || "No user found"));
      }
      const userId = user.id;

      // Make the FastAPI backend logout call
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://whimsera.com";
      const response = await fetch(`${backendUrl}/users/${userId}/session`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backend logout failed: ${errorData.detail || response.statusText}`);
      }

      // Proceed with Supabase logout
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw new Error("Supabase logout failed: " + signOutError.message);
      }

      // Redirect to login page
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

    // Calculate ripple size using clamp equivalent
    const clampValue = (min: number, val: number, max: number) => Math.min(Math.max(min, val), max);
    const vw = window.innerWidth * 0.05; // 5vw in pixels
    const rippleSize = clampValue(30, vw, 50); // clamp(30px, 5vw, 50px)

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
      className="fixed top-0 left-0 z-50 w-full flex flex-wrap justify-between items-center px-4 sm:px-6 py-2 sm:py-3 shadow-md overflow-visible"
      style={{
        background:
          "linear-gradient(45deg, rgba(108,92,231,0.8) 0%, rgba(0,191,166,0.8) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* 💫 Ripple Layer */}
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

      {/* 🌈 Brand */}
      <Link
        href="/dashboard"
        className="text-4xl sm:text-5xl md:text-6xl leading-none font-bold text-white relative z-10 transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(44,62,80,0.8)]"
        style={{ fontFamily: "var(--font-annie)" }}
      >
        Whimsera
      </Link>

      {/* 🧭 Controls */}
      <div className="flex flex-wrap items-center space-x-3 sm:space-x-4 md:space-x-6 relative z-10">
        {isAuthenticated && (
          <>
            <Link href="/start-story">
              <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-md font-poppins font-bold text-sm sm:text-base md:text-lg bg-[#FFD166] text-[#2D3436] hover:bg-[#FF7675] hover:text-white transition">
                Start New Story
              </button>
            </Link>
            <Link href="/feedback">
              <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-md font-poppins font-bold text-sm sm:text-base md:text-lg bg-[#FFD166] text-[#2D3436] hover:bg-[#FF7675] hover:text-white transition">
                Give Feedback
              </button>
            </Link>

            {/* 👤 Profile Dropdown */}
            <div ref={dropdownRef} className="relative profile-dropdown">  {/* ← Add class here */}
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-white text-2xl sm:text-3xl md:text-4xl hover:text-[#FFD166] cursor-pointer select-none"
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
                    className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <Link
                      href="/profile-settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm sm:text-base"
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