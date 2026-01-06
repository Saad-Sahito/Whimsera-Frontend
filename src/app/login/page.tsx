// src/app/login/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const { setAuthenticated, setUserId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setFormError("Please enter both email and password");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setFormError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setAuthenticated(true);
      setUserId(data.user.id);
      router.push("/dashboard");
    } else {
      setFormError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen magical gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #6C5CE7 0%, #00BFA6 100%)",
        }}
      />

      {/* Animated glowing orbs for magical depth (no images) */}
      <div className="absolute inset-0 -z-5 opacity-40">
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#FFD166]/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#74C0FC]/40 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#FF7675]/30 rounded-full blur-3xl animate-ping" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-20 w-[90%] max-w-md rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.85), rgba(0, 191, 166, 0.85))",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD166]/10 via-transparent to-[#FF7675]/10 rounded-3xl" />
        </div>

        <div className="p-10 pt-12 pb-10 flex flex-col items-center space-y-8">
          <Link
            href="/"
            className="text-6xl md:text-7xl lg:text-8xl leading-none font-bold text-white drop-shadow-2xl"
            style={{ fontFamily: "var(--font-annie)" }}
          >
            Whimsera
          </Link>

          <h2 className="text-3xl font-bold text-white tracking-wide">
            Welcome Back
          </h2>

          {formError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-200 bg-red-500/30 px-6 py-3 rounded-xl text-sm text-center backdrop-blur-sm w-full"
            >
              {formError}
            </motion.p>
          )}

          <form className="w-full flex flex-col space-y-6" onSubmit={handleLogin}>
            <div className="flex flex-col">
              <label className="text-lg font-semibold text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="px-5 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="px-5 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-xl font-semibold text-[#2D3436] shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #FFD166 0%, #FF7675 100%)",
              }}
            >
              {loading ? "Logging in..." : "Log In ✨"}
            </motion.button>

            <div className="text-center text-white/80">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#FFD166] font-semibold hover:underline transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}