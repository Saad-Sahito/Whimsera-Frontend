// src/app/components/AIMagic.tsx
"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "Narrative Intelligence",
    desc: "Every tale unfolds through a deep understanding of tone, pacing, and your choices.",
  },
  {
    icon: "💬",
    title: "Emotional Dialogue",
    desc: "Characters remember what you say — and how you make them feel.",
  },
  {
    icon: "🌍",
    title: "Persistent Worlds",
    desc: "Whimsera remembers your adventures, evolving worlds and relationships over time.",
  },
  {
    icon: "⚡",
    title: "Instant Story Crafting",
    desc: "Begin new stories in seconds, powered by adaptive AI fine-tuned for creativity.",
  },
];

export default function AIMagic() {
  return (
    <section
      className="
        relative
        bg-[rgba(42,52,57,0.8)]   /* Gunmetal with slight transparency */
        py-28 px-8 md:px-24
        text-center text-gray-200
        overflow-hidden
        m-0 p-0 md:py-24
      "
    >
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-5xl font-fredoka mb-6 text-white"
      >
        AI Behind the Magic
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-gray-300 mb-16"
      >
        Beneath every story lies a powerful creative engine — one that listens,
        learns, and adapts to your imagination.
      </motion.p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 md:px-24 pb-24">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="
              bg-gradient-to-br from-[#1E2428]/80 to-[#2A2A35]/60
              rounded-xl
              p-8
              hover:from-[#2A2A35]/90 hover:to-[#2A2A35]/70
              transition-all
              border border-[#38A3A5]/30 hover:border-[#FFD166]/50
              shadow-md
            "
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-fredoka text-white mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
