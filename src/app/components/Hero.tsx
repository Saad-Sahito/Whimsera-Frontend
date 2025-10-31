"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);

  const heroWords = [
    { text: "Create", color: "#6C5CE7" },
    { text: "Explore", color: "#00BFA6" },
    { text: "Choose", color: "#FF7675" },
    { text: "Adventure", color: "#FFD166" }
  ];

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: [
                "rgba(108,92,231,0.08)", 
                "rgba(0,191,166,0.08)", 
                "rgba(255,118,117,0.08)",
                "rgba(255,209,102,0.08)"
              ][i % 4],
            }}
            animate={{ 
              y: [0, -40, 0], 
              x: [0, 30, 0], 
              scale: [1, 1.15, 1] 
            }}
            transition={{ 
              duration: 20 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 mb-8 shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
          <span className="text-sm font-semibold text-[#2D3436]" style={{ fontFamily: "var(--font-poppins)" }}>
            AI-Powered Interactive Storytelling
          </span>
        </motion.div>

        {/* Main Headline - Large and Bold */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#2D3436] leading-tight mb-6"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Where Stories
            <br />
            <span className="bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] bg-clip-text text-transparent">
              Come Alive
            </span>
          </h1>

          {/* Animated word carousel */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                onHoverStart={() => setHoveredWord(i)}
                onHoverEnd={() => setHoveredWord(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-3xl md:text-4xl font-bold cursor-default transition-all duration-300"
                style={{ 
                  fontFamily: "var(--font-fredoka)",
                  color: hoveredWord === i ? word.color : "#2D3436",
                  transform: hoveredWord === i ? "scale(1.1)" : "scale(1)"
                }}
              >
                {word.text}
                {i < heroWords.length - 1 && (
                  <span className="text-[#2D3436]/30 mx-2">•</span>
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-[#2D3436]/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Every choice shapes your unique tale. Powered by AI that understands narrative, emotion, and your imagination.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white rounded-full font-bold text-lg shadow-2xl overflow-hidden"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Adventure
              <Sparkles className="w-5 h-5" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7]"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            onClick={scrollToContent}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white/60 backdrop-blur-md border-2 border-[#2D3436]/20 text-[#2D3436] rounded-full font-bold text-lg hover:bg-white hover:border-[#6C5CE7] transition-all shadow-lg"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Explore Features
          </motion.button>
        </motion.div>

        {/* Feature highlights - minimal pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-4 text-sm"
        >
          {[
            "Unlimited Stories",
            "Every Genre Imaginable", 
            "Your Choices Matter",
            "AI-Powered Narrative"
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60 text-[#2D3436]/80 font-medium shadow-sm"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {/* <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 group cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span 
            className="text-sm text-[#2D3436]/60 font-medium group-hover:text-[#6C5CE7] transition-colors"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Discover More
          </span>
          <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center shadow-lg group-hover:bg-[#6C5CE7] group-hover:border-[#6C5CE7] transition-all">
            <ArrowDown className="w-5 h-5 text-[#2D3436] group-hover:text-white transition-colors" />
          </div>
        </motion.div>
      </motion.button> */}

      {/* Subtle wave transition */}
      {/* <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 opacity-20"
        >
          <path 
            d="M0 50 Q360 0 720 50 T1440 50 V120 H0 V50Z" 
            fill="currentColor"
            className="text-[#2D3436]"
          />
        </svg>
      </div> */}
    </section>
  );
}