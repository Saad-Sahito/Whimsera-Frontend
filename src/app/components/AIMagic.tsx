"use client";

import { motion } from "framer-motion";
import { Brain, MessageCircle, Globe, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    Icon: Brain,
    title: "Narrative Intelligence",
    desc: "Every tale unfolds through deep understanding of tone, pacing, and your choices.",
    color: "#6C5CE7",
    gradient: "from-[#6C5CE7]/15 to-[#6C5CE7]/5",
  },
  {
    Icon: MessageCircle,
    title: "Emotional Dialogue",
    desc: "Characters remember what you say — and how you make them feel.",
    color: "#FF7675",
    gradient: "from-[#FF7675]/15 to-[#FF7675]/5",
  },
  {
    Icon: Globe,
    title: "Persistent Worlds",
    desc: "Whimsera remembers your adventures, evolving worlds and relationships over time.",
    color: "#00BFA6",
    gradient: "from-[#00BFA6]/15 to-[#00BFA6]/5",
  },
  {
    Icon: Zap,
    title: "Instant Story Crafting",
    desc: "Begin new stories in seconds, powered by adaptive AI fine-tuned for creativity.",
    color: "#FFD166",
    gradient: "from-[#FFD166]/15 to-[#FFD166]/5",
  },
];

export default function AIMagicRedesign() {
  return (
    <section className="relative py-24 px-8 overflow-visible ">
      {/* Subtle animated background blobs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <motion.div
          className="absolute top-16 left-8 w-80 h-80 bg-[#6C5CE7]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-16 right-8 w-96 h-96 bg-[#00BFA6]/20 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6C5CE7]/15 to-[#00BFA6]/15 border-2 border-[#6C5CE7]/30 mb-5 shadow-sm">
            <Zap className="w-5 h-5 text-[#6C5CE7]" />
            <span className="text-sm font-bold text-[#2D3436]">Powered by Advanced AI</span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            The Magic Behind
            <span className="block mt-2 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] bg-clip-text text-transparent text-5xl md:text-6xl">
              Every Story
            </span>
          </h2>

          <p className="text-lg text-[#2D3436]/75 max-w-2xl mx-auto font-medium">
            Beneath every adventure lies a powerful creative engine that listens, learns, and adapts to your imagination
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative"
              >
                {/* Hover glow */}
                <div
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}50, ${feature.color}20)`,
                  }}
                />

                {/* Card */}
                <div
                  className="relative bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl transition-all duration-300 h-full flex flex-col"
                  style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                >
                  {/* Icon with pulse */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}25, ${feature.color}10)`,
                      boxShadow: `0 0 20px ${feature.color}40`,
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Icon className="w-8 h-8" style={{ color: feature.color }} />
                  </motion.div>

                  {/* Title – colored gradient */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-fredoka)",
                      background: `linear-gradient(90deg, ${feature.color}, ${feature.color}dd)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#2D3436]/80 leading-relaxed flex-1">
                    {feature.desc}
                  </p>

                  {/* REMOVED: decorative corner accent */}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Prominent CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-[#2D3436]/80 text-lg font-medium mb-6">
            Ready to experience AI-powered storytelling?
          </p>

          {/* <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            style={{
              boxShadow: "0 12px 35px rgba(108, 92, 231, 0.35)",
            }}
          >
            Try It Now
            <ArrowRight className="w-6 h-6" />
          </motion.button> */}
        </motion.div>
      </div>
    </section>
  );
}