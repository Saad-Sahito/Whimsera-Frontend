"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wand2, User, Map, Palette, Zap, BookOpen, Sparkles, Star } from "lucide-react";

const features = [
  {
    Icon: User,
    title: "Your Hero",
    description: "Create protagonists with unique personalities, backgrounds, and goals",
    examples: ["Detective", "Space Explorer", "Medieval Knight", "Time Traveler"],
    color: "#6C5CE7",
    gradient: "from-[#6C5CE7] to-[#8B7FE8]",
    bgGradient: "from-[#6C5CE7]/10 to-[#8B7FE8]/5",
  },
  {
    Icon: Map,
    title: "Your World",
    description: "Build settings from cozy villages to sprawling galaxies",
    examples: ["Fantasy Realm", "Cyberpunk City", "Haunted Manor", "Alien Planet"],
    color: "#00BFA6",
    gradient: "from-[#00BFA6] to-[#00D4B5]",
    bgGradient: "from-[#00BFA6]/10 to-[#00D4B5]/5",
  },
  {
    Icon: Palette,
    title: "Your Tone",
    description: "Set the mood from lighthearted comedy to dark suspense",
    examples: ["Lighthearted", "Adventurous", "Dramatic", "Intense"],
    color: "#FFD166",
    gradient: "from-[#FFD166] to-[#FFE066]",
    bgGradient: "from-[#FFD166]/10 to-[#FFE066]/5",
  },
  {
    Icon: Zap,
    title: "Your Pace",
    description: "Control story length and intensity to match your reading style",
    examples: ["Short Story", "Novelette", "Full Novel", "Epic Series"],
    color: "#FF7675",
    gradient: "from-[#FF7675] to-[#FF9B9A]",
    bgGradient: "from-[#FF7675]/10 to-[#FF9B9A]/5",
  },
];

export default function CreativeFreedom() {
  return (
    <section className="relative py-20 px-6 overflow-visible ">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <motion.div
          className="absolute top-10 left-1/4 w-96 h-96 bg-[#FF7675]/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], rotate: [0, 120, 0], x: [0, 50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#FFD166]/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#6C5CE7]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -180, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white font-bold shadow-xl border-2 border-white/50"
            animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wand2 className="w-6 h-6" />
            <span className="text-sm">Unlimited Creativity</span>
            <Wand2 className="w-6 h-6" />
          </motion.div>

          <h2
            className="text-5xl md:text-6xl font-bold text-[#2D3436] mt-8 mb-5 leading-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            You&apos;re the
            <span className="block mt-3 bg-gradient-to-r from-[#FF7675] via-[#FFD166] to-[#6C5CE7] bg-clip-text text-transparent text-6xl md:text-7xl">
              Creative Director
            </span>
          </h2>

          <p className="text-xl text-[#2D3436]/70 max-w-2xl mx-auto font-medium leading-relaxed" style={{ fontFamily: "var(--font-nunito)" }}>
            Shape every detail. No limits. Just pure storytelling magic powered by AI.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative"
              >
                {/* Glow Background */}
                <motion.div
                  className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}40, transparent)`,
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Card */}
                <div
                  className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/50 shadow-xl overflow-visible"
                  style={{
                    background: `linear-gradient(to bottom right, ${feature.bgGradient}, white)`,
                  }}
                >
                  {/* Top Accent Bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                    style={{
                      background: `linear-gradient(to right, ${feature.color}, ${feature.color}CC)`,
                    }}
                  />

                  <div className="flex items-start gap-5 mb-5">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}25, ${feature.color}10)`,
                        boxShadow: `0 0 25px ${feature.color}50`,
                      }}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.7 }}
                    >
                      <Icon className="w-8 h-8" style={{ color: feature.color }} />
                    </motion.div>

                    <div className="flex-1">
                      <h3
                        className="text-2xl font-bold text-[#2D3436] mb-2"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-[#2D3436]/75 leading-relaxed" style={{ fontFamily: "var(--font-nunito)" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Example Tags */}
                  <div className="flex flex-wrap gap-2.5">
                    {feature.examples.map((example, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + j * 0.08 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-default border"
                        style={{
                          background: `${feature.color}08`,
                          borderColor: `${feature.color}40`,
                          color: feature.color,
                          fontFamily: "var(--font-poppins)",
                        }}
                      >
                        {example}
                      </motion.span>
                    ))}
                  </div>

                  {/* Floating Sparkle on Hover */}
                  <motion.div
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.5, 0], rotate: 180 }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-6 h-6" style={{ color: feature.color }} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Story Seed Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border-2 border-white/60 overflow-visible">
            {/* Rainbow Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF7675] via-[#FFD166] via-[#6C5CE7] to-[#00BFA6] rounded-t-3xl" />

            <div className="flex items-center gap-4 mb-7">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD166] to-[#FF7675] flex items-center justify-center shadow-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <BookOpen className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-[#2D3436]" style={{ fontFamily: "var(--font-fredoka)" }}>
                  Example: Your Story Seed
                </h3>
                <p className="text-sm text-[#2D3436]/60" style={{ fontFamily: "var(--font-poppins)" }}>
                  Built in seconds using your choices
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { label: "Story Type", value: "Interactive Adventure", color: "#00BFA6" },
                { label: "Genre", value: "Sci-Fi Mystery", color: "#6C5CE7" },
                { label: "Setting", value: "Neo-Tokyo, 2089 – where humans and AI coexist uneasily", color: "#FFD166" },
                { label: "Tone", value: "Cerebral thriller with moments of wonder", color: "#FF7675" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <span
                    className="px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                      fontFamily: "var(--font-poppins)",
                      boxShadow: `0 0 15px ${item.color}30`,
                    }}
                  >
                    {item.label}
                  </span>
                  <span className="text-[#2D3436]/85 font-medium" style={{ fontFamily: "var(--font-nunito)" }}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 pt-6 border-t-2 border-dashed border-[#E5E5E5]/50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#2D3436]/70" style={{ fontFamily: "var(--font-poppins)" }}>
                  From idea to story in{" "}
                  <span className="font-bold text-[#6C5CE7]">under 30 seconds</span>
                </p>
                <motion.div
                  className="flex items-center gap-2 text-lg font-bold"
                  style={{ color: "#6C5CE7", fontFamily: "var(--font-poppins)" }}
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Begin Creating
                  <Zap className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Stars */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4"
                style={{
                  top: `${15 + i * 20}%`,
                  right: `${10 + i * 15}%`,
                  color: i % 2 === 0 ? "#FFD166" : "#FF7675",
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              >
                <Star className="w-full h-full" fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}