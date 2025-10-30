"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, BookOpen, Wand2 } from "lucide-react";

export default function HeroRedesign() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: Sparkles, text: "AI-Powered Stories" },
    { icon: BookOpen, text: "Your Choices Matter" },
    { icon: Wand2, text: "Endless Adventures" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8F1] via-[#E5E5E5]/30 to-[#74C0FC]/10">
      
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: [
                "rgba(108,92,231,0.03)",
                "rgba(0,191,166,0.03)",
                "rgba(255,209,102,0.03)"
              ][i % 3],
              filter: "blur(40px)"
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        
        {/* Eyebrow text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6C5CE7]/10 to-[#00BFA6]/10 border border-[#6C5CE7]/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
          <span className="text-sm font-medium text-[#2D3436]">
            Where Imagination Comes to Life
          </span>
        </motion.div>

        {/* Main headline - shorter and punchier */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-[#2D3436] mb-6 leading-tight"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Your Story,
          <br />
          <span className="bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] bg-clip-text text-transparent">
            Your Adventure
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-[#2D3436]/70 mb-12 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Create interactive stories powered by AI. Every choice shapes your unique tale.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button className="group relative px-8 py-4 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="relative z-10">Start Creating Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="px-8 py-4 border-2 border-[#6C5CE7] text-[#6C5CE7] rounded-full font-semibold text-lg hover:bg-[#6C5CE7] hover:text-white transition-all duration-300">
            See How It Works
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                onHoverStart={() => setHoveredFeature(i)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/50 backdrop-blur-sm border border-[#E5E5E5] cursor-default shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Icon 
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ 
                    color: hoveredFeature === i ? "#6C5CE7" : "#2D3436"
                  }}
                />
                <span className="text-sm font-medium text-[#2D3436]">
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating story preview card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-[#E5E5E5]">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6C5CE7]/20 via-[#00BFA6]/20 to-[#FFD166]/20 rounded-2xl blur-lg opacity-50" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#00BFA6] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2D3436]">The Enchanted Forest</h3>
                  <p className="text-sm text-[#2D3436]/60">Adventure • Fantasy</p>
                </div>
              </div>
              
              <p className="text-[#2D3436]/80 text-left leading-relaxed">
                You stand at the edge of a mysterious forest. Ancient trees whisper secrets in the wind. 
                <span className="text-[#6C5CE7] font-medium"> What do you do?</span>
              </p>
              
              <div className="flex gap-3 mt-4">
                <div className="flex-1 p-3 bg-[#FFF8F1] rounded-lg border border-[#E5E5E5] text-sm text-[#2D3436]/70 hover:border-[#6C5CE7] transition-colors cursor-pointer">
                  🗡️ Enter boldly
                </div>
                <div className="flex-1 p-3 bg-[#FFF8F1] rounded-lg border border-[#E5E5E5] text-sm text-[#2D3436]/70 hover:border-[#6C5CE7] transition-colors cursor-pointer">
                  👀 Observe quietly
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50 Q360 0 720 50 T1440 50 V120 H0 V50Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}