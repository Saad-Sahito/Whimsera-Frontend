
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { setAuthenticated, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added for success message
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setEmailError("");
    setSuccessMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !password || !confirmPassword) {
      setFormError("All required fields must be filled");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await resp.json();

      if (!resp.ok) {
        if (json.error === "email_taken") {
          setEmailError("This email is already registered");
        } else {
          setFormError("Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Show success message instead of redirecting
      setSuccessMessage("Registration successful! Please check your email to confirm.");
      setLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setFormError(message);
      setLoading(false);
    }
  };

  const checkEmail = async (email: string) => {
    if (!email) {
      setEmailError("");
      return;
    }
    const response = await fetch("/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { exists, error } = await response.json();
    if (error) {
      setEmailError("Error checking email: " + error);
      return;
    }
    setEmailError(exists ? "Email is already registered" : "");
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/download.jpeg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 bg-white/10 shadow-2xl w-[90%] max-w-xl flex flex-col items-center backdrop-blur-lg signup-box"
        style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.85), rgba(0, 191, 166, 0.85))",
          padding: "28px",
          gap: "25px",
          borderRadius: "48px",
        }}
      >
        <Link
          href="/"
          className="text-6xl md:text-7xl lg:text-8xl leading-none font-bold text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-annie)" }}
        >
          Whimsera
        </Link>

        <h2 className="text-3xl font-fredoka font-bold text-white">Create Your Account</h2>

        {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

        {!successMessage && (
          <form className="w-full flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label className="text-lg font-nunito mb-2 text-white">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
                onChange={(e) => checkEmail(e.target.value)}
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div className="flex flex-col text-left">
              <label className="text-lg font-nunito mb-2 text-white">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="px-4 py-3 rounded-xl border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
                required
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="text-lg font-nunito mb-2 text-white">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                className="px-4 py-3 rounded-xl border border-white/50 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00BFA6] to-[#FFD166] text-[#2D3436] py-3 rounded-xl text-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <p className="text-center text-white font-nunito mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FFD166] font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </main>
  );
}
