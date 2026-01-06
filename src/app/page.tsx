"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Logic from your provided file
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

      setSuccessMessage("Registration successful! Check your email to confirm.");
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
    if (error) return;
    setEmailError(exists ? "Email is already registered" : "");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] text-[#2D3436] selection:bg-[#FFD166] overflow-x-hidden">
      
      {/* --- BLENDING NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/10">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-bold text-[#6C5CE7]" style={{ fontFamily: "var(--font-annie)" }}>
            Whimsera
          </Link>
          <Link href="/pricing" className="hidden md:block text-sm font-semibold hover:text-[#00BFA6] transition-colors">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-semibold hover:opacity-70 transition-opacity">
            Log In
          </Link>
          <button 
            onClick={() => setIsSignUpOpen(true)}
            className="bg-[#6C5CE7] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#6C5CE7]/20 hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-[#FFD166]/20 text-[#FF7675] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            AI-Powered Story Architect
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Plot your next <span className="text-[#00BFA6]">masterpiece</span> <br /> 
            in a heartbeat.
          </h1>
          <p className="text-lg md:text-xl text-[#2D3436]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Whimsera turns your sparks of imagination into structured story outlines. 
            Perfect for novelists, game devs, and screenwriters.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSignUpOpen(true)}
            className="bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-[#6C5CE7]/40 transition-all"
          >
            Start Writing Your Story ✨
          </motion.button>
        </motion.div>

        {/* --- DECORATIVE MOCKUP --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 w-full max-w-5xl aspect-video bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6C5CE7]/5 to-[#00BFA6]/5" />
          <div className="flex p-4 gap-2 border-b border-[#E5E5E5]">
             <div className="w-3 h-3 rounded-full bg-[#FF7675]" />
             <div className="w-3 h-3 rounded-full bg-[#FFD166]" />
             <div className="w-3 h-3 rounded-full bg-[#00BFA6]" />
          </div>
          <div className="p-8 text-left space-y-4">
             <div className="h-8 w-1/3 bg-[#E5E5E5] rounded animate-pulse" />
             <div className="h-4 w-full bg-[#E5E5E5]/50 rounded animate-pulse" />
             <div className="h-4 w-5/6 bg-[#E5E5E5]/50 rounded animate-pulse" />
          </div>
        </motion.div>
      </main>

      {/* --- SIGN UP POPUP --- */}
      <AnimatePresence>
        {isSignUpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignUpOpen(false)}
              className="absolute inset-0 bg-[#2D3436]/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166]" />
              
              <div className="p-8 md:p-10">
                <button 
                  onClick={() => setIsSignUpOpen(false)}
                  className="absolute top-6 right-6 text-[#2D3436]/40 hover:text-[#2D3436]"
                >
                  ✕
                </button>

                <h2 className="text-3xl font-bold mb-2">Join Whimsera</h2>
                <p className="text-[#2D3436]/60 mb-8 text-sm">Create your account to start mapping your world.</p>

                {formError && (
                  <div className="mb-6 p-3 bg-[#FF7675]/10 text-[#FF7675] text-xs font-semibold rounded-lg border border-[#FF7675]/20">
                    {formError}
                  </div>
                )}

                {successMessage ? (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-4">✨</div>
                    <p className="font-bold text-[#00BFA6] mb-6">{successMessage}</p>
                    <button 
                      onClick={() => router.push("/login")}
                      className="w-full bg-[#6C5CE7] text-white py-4 rounded-xl font-bold"
                    >
                      Go to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3436]/40 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        onChange={(e) => checkEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#E5E5E5]/30 border-2 border-transparent focus:border-[#6C5CE7] focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="penname@author.com"
                      />
                      {emailError && <p className="text-[#FF7675] text-[10px] mt-1 font-bold">{emailError}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3436]/40 mb-2">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        required
                        className="w-full px-4 py-3 bg-[#E5E5E5]/30 border-2 border-transparent focus:border-[#6C5CE7] focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#2D3436]/40 mb-2">Confirm Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        required
                        className="w-full px-4 py-3 bg-[#E5E5E5]/30 border-2 border-transparent focus:border-[#6C5CE7] focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      disabled={loading || !!emailError}
                      type="submit"
                      className="w-full bg-[#2D3436] text-white py-4 rounded-xl font-bold hover:bg-[#6C5CE7] transition-colors shadow-lg disabled:opacity-50"
                    >
                      {loading ? "Creating Magic..." : "Create Account"}
                    </button>
                  </form>
                )}

                <p className="mt-8 text-center text-sm text-[#2D3436]/50">
                  Already a member? <Link href="/login" className="text-[#6C5CE7] font-bold">Log In</Link>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}