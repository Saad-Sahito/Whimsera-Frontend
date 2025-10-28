//src/app/login/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase/client"; // ✅ use shared client

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

    // ✅ Use existing client so session is shared with AuthProvider
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
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/download-(2).png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 bg-transparent rounded-3xl shadow-2xl p-12 w-[90%] max-w-md flex flex-col items-center space-y-8 text-white"
      >
        <Link
          href="/"
          className="text-6xl md:text-7xl lg:text-8xl leading-none font-bold text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-annie)" }}
        >
          Whimsera
        </Link>

        <h2 className="text-3xl font-fredoka font-bold text-white">
          Welcome Back
        </h2>

        {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}

        <form className="w-full flex flex-col space-y-6" onSubmit={handleLogin}>
          <div className="flex flex-col text-left">
            <label className="text-lg font-nunito mb-2 text-white">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-xl border border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
              required
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="text-lg font-nunito mb-2 text-white">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="px-4 py-3 rounded-xl border border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00BFA6] text-white font-poppins py-3 rounded-xl text-xl font-semibold hover:bg-[#00a38e] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <Link href="/signup" className="w-full">
            <button
              type="button"
              className="w-full border-2 border-white font-poppins text-white py-3 rounded-xl text-xl font-semibold hover:bg-white hover:text-[#FF7675] transition-all duration-300"
            >
              Sign Up
            </button>
          </Link>
        </form>
      </motion.div>
    </main>
  );
}
