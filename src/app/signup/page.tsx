"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
//import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  //const { setAuthenticated, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
        backgroundImage: "url('/download.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 bg-white/10 shadow-2xl w-[90%] max-w-xl flex flex-col items-center backdrop-blur-lg"
        style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.9), rgba(0, 191, 166, 0.85))",
          padding: "40px",
          gap: "25px",
          borderRadius: "48px",
        }}
      >
        <Link
          href="/"
          className="text-5xl md:text-6xl leading-none font-bold text-white drop-shadow-lg mb-2"
          style={{ fontFamily: "var(--font-annie)" }}
        >
          Whimsera
        </Link>

        <h2 className="text-3xl font-bold text-white text-center">Create Your Account</h2>

        {formError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-200 bg-red-500/30 px-4 py-2 rounded-lg text-sm text-center backdrop-blur-sm w-full"
          >
            {formError}
          </motion.p>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-gradient-to-r from-[#00BFA6] to-[#74C0FC] p-6 rounded-2xl text-center"
          >
            <div className="text-5xl mb-3">✨</div>
            <p className="text-white text-lg font-semibold">{successMessage}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
              className="mt-4 bg-white/20 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
            >
              Go to Login
            </motion.button>
          </motion.div>
        )}

        {!successMessage && (
          <form className="w-full flex flex-col space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label className="text-lg mb-2 text-white font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl border-2 border-white/50 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm transition-all duration-300"
                onChange={(e) => checkEmail(e.target.value)}
                required
              />
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-200 text-sm mt-2 bg-red-500/20 px-3 py-1 rounded-lg"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            <div className="flex flex-col text-left">
              <label className="text-lg mb-2 text-white font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="px-4 py-3 rounded-xl border-2 border-white/50 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm transition-all duration-300"
                required
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-lg mb-2 text-white font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                className="px-4 py-3 rounded-xl border-2 border-white/50 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm transition-all duration-300"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !!emailError}
              className="w-full bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436] py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up ✨"}
            </motion.button>

            <p className="text-center text-white mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FFD166] font-semibold hover:underline transition-all duration-300">
                Log In
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </main>
  );
}