"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles,Rocket, Mail, ArrowRight, Check, Star, Zap, Gift, Shield } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  if (!email || isLoading) return;
  setIsLoading(true);

  try {
    const response = await fetch("/api/submit-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});


    const result = await response.json();
    console.log(result); // should log { status: "success" }

    setSubmitted(true);
    setEmail("");
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
  } finally {
    setIsLoading(false);
  }
};


  const benefits = [
    {
      text: "Early access to Whimsera before public launch",
      icon: Rocket,
      color: "#6C5CE7",
      gradient: "from-[#6C5CE7] to-[#8B7FE8]",
    },
    {
      text: "Free story creation during beta period",
      icon: Sparkles,
      color: "#FFD166",
      gradient: "from-[#FFD166] to-[#FFE066]",
    },
    {
      text: "Shape the future with your feedback",
      icon: Zap,
      color: "#00BFA6",
      gradient: "from-[#00BFA6] to-[#00D4B5]",
    },
    {
      text: "Exclusive discount for beta testers after launch",
      icon: Gift,
      color: "#FF7675",
      gradient: "from-[#FF7675] to-[#FF9B9A]",
    },
  ];

  return (
    <section className="relative py-20 px-6 overflow-visible ">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-80 h-80 bg-[#FFD166]/25 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#6 ستC5CE7]/20 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#00BFA6]/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration:  18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFE066] text-[#2D3436] font-bold shadow-lg border-2 border-white/50"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-[#2D3436]" />
            <span className="text-sm">Limited Beta Access</span>
            <Sparkles className="w-5 h-5 text-[#2D3436]" />
          </motion.div>

          <h2
            className="text-5xl md:text-7xl font-bold text-[#2D3436] mt-6 mb-5 leading-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Be Among the First
            <span className="block mt-3 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#FFD166] bg-clip-text text-transparent text-6xl md:text-8xl">
              Storytellers
            </span>
          </h2>

          <p className="text-xl text-[#2D3436]/70 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-nunito)" }}>
            Join the waitlist to unlock early access. No credit card. Just magic.
          </p>
        </motion.div>

        {/* Benefits Grid – Colorful Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-5 mb-14 max-w-3xl mx-auto"
        >
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group relative p-5 bg-white rounded-2xl shadow-lg border-2 border-white/50 overflow-visible"
              >
                {/* Gradient Background */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${benefit.color}, transparent)`,
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${benefit.color}20, ${benefit.color}05)`,
                      boxShadow: `0 0 20px ${benefit.color}40`,
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6" style={{ color: benefit.color }} />
                  </motion.div>

                  <span className="text-[#2D3436] font-medium leading-relaxed" style={{ fontFamily: "var(--font-poppins)" }}>
                    {benefit.text}
                  </span>
                </div>

                {/* Sparkle on hover */}
                <motion.div
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: benefit.color }} />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative"
              >
                {/* Shimmer Glow */}
                <motion.div
                  className="absolute -inset-2 rounded-3xl opacity-40"
                  animate={{
                    background: [
                      "linear-gradient(90deg, transparent, #6C5CE7, #00BFA6, #FFD166, transparent)",
                      "linear-gradient(90deg, transparent, #FFD166, #00BFA6, #6C5CE7, transparent)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ filter: "blur(20px)" }}
                />

                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6C5CE7]" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#6C5CE7] focus:outline-none transition-all text-[#2D3436] placeholder:text-[#2D3436]/40 text-lg"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      />
                    </div>

                    <motion.button
                      onClick={handleSubmit}
                      disabled={isLoading || !email}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-10 py-5 bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] text-white font-bold rounded-2xl shadow-xl overflow-visible group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <motion.div
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                      />
                    </motion.button>
                  </div>

                  <p className="text-sm text-[#2D3436]/60 mt-5 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
                    We respect your privacy. No spam, ever.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="bg-gradient-to-br from-[#6C5CE7] to-[#00BFA6] rounded-3xl p-10 shadow-2xl text-center text-white"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>

                <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                  You&apos;re In! 
                </h3>

                {/* <p className="text-lg mb-6 opacity-90" style={{ fontFamily: "var(--font-nunito)" }}>
                  Check your inbox for confirmation. The magic begins soon.
                </p> */}

                <p className="text-sm opacity-80" style={{ fontFamily: "var(--font-poppins)" }}>
                  Follow us for updates & sneak peeks!
                </p>

                {/* Confetti Stars */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${20 + i * 10}%`,
                      color: i % 2 === 0 ? "#FFD166" : "#FF7675",
                    }}
                    animate={{
                      y: [0, -30, 0],
                      rotate: [0, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Star className="w-full h-full" fill="currentColor" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          {/* <p className="text-sm text-[#2D3436]/60 mb-5" style={{ fontFamily: "var(--font-poppins)" }}>
            Trusted by dreamers worldwide
          </p> */}
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {[
              { Icon: Sparkles, label: "AI-Powered", color: "#6C5CE7" },
              { Icon: Shield, label: "Secure & Private", color: "#00BFA6" },
              { Icon: Zap, label: "Lightning Fast", color: "#FFD166" },
            ].map(({ Icon, label, color }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    background: `${color}15`,
                    boxShadow: `0 0 15px ${color}40`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-sm font-semibold text-[#2D3436]" style={{ fontFamily: "var(--font-poppins)" }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}