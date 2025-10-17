"use client";

import { motion } from "framer-motion";

export default function WhatIsWhimsera() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[rgba(229,228,226,0.8)] text-gray-900 overflow-hidden">
      {/* Sharper Pulsating Circular Gradient */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(72,191,145,0.8) 0%, rgba(255,255,255,0) 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Text Content */}
      <div className="relative z-10 max-w-3xl text-center px-8">
        <h2 className="text-6xl font-fredoka font-semi-bold mb-8 text-[#6C5CE7]">
          What is Whimsera?
        </h2>
        <p className="text-lg leading-relaxed font-nunito font-semi-bold text-gray-800">
          Whimsera is your AI-powered creative companion — a space where stories
          come alive through imagination and intelligent storytelling. Whether
          you’re an author, gamer, or dreamer, Whimsera adapts to your
          creativity, weaving experiences shaped by your choices.
        </p>
      </div>
    </section>
  );
}
