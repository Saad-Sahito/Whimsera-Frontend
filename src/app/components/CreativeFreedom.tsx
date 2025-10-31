"use client";

import { motion } from "framer-motion";
import { Wand2, User, Map, Palette, Zap, BookOpen } from "lucide-react";

const features = [
  {
    Icon: User,
    title: "Your Hero",
    description: "Create protagonists with unique personalities, backgrounds, and goals",
    examples: ["Detective", "Space Explorer", "Medieval Knight", "Time Traveler"]
  },
  {
    Icon: Map,
    title: "Your World",
    description: "Build settings from cozy villages to sprawling galaxies",
    examples: ["Fantasy Realm", "Cyberpunk City", "Haunted Manor", "Alien Planet"]
  },
  {
    Icon: Palette,
    title: "Your Tone",
    description: "Set the mood from lighthearted comedy to dark suspense",
    examples: ["Whimsical", "Dark & Gritty", "Romantic", "Mysterious"]
  },
  {
    Icon: Zap,
    title: "Your Pace",
    description: "Control story length and intensity to match your reading style",
    examples: ["Quick Tales", "Epic Sagas", "Bite-sized", "Marathon"]
  }
];

export default function CreativeFreedom() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-1/4 w-96 h-96 bg-[#FF7675]/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#FFD166]/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, 40, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
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
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border-2 border-[#FF7675]/30 mb-6 shadow-sm"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wand2 className="w-5 h-5 text-[#FF7675]" />
            <span className="text-sm font-bold text-[#2D3436]">Unlimited Creativity</span>
          </motion.div>

          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            You're the
            <span className="block mt-2 bg-gradient-to-r from-[#FF7675] via-[#FFD166] to-[#6C5CE7] bg-clip-text text-transparent text-5xl md:text-6xl">
              Creative Director
            </span>
          </h2>

          <p className="text-lg text-[#2D3436]/75 max-w-2xl mx-auto font-medium" style={{ fontFamily: "var(--font-nunito)" }}>
            Shape every aspect of your story. No templates, no restrictions—just pure creative freedom guided by intelligent AI.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7675]/20 via-[#6C5CE7]/20 to-[#00BFA6]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 border-2 border-[#E5E5E5] group-hover:border-[#FF7675]/30 transition-all duration-300 shadow-lg">
                  {/* Icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7675]/20 to-[#FFD166]/20 flex items-center justify-center shadow-sm"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-[#FF7675]" />
                    </motion.div>

                    <div className="flex-1">
                      <h3
                        className="text-2xl font-bold text-[#2D3436] mb-2"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                      >
                        {feature.title}
                      </h3>
                      <p 
                        className="text-[#2D3436]/70 leading-relaxed"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Example tags */}
                  <div className="flex flex-wrap gap-2">
                    {feature.examples.map((example, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.05 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#FFF8F1] to-[#FFE5E5] rounded-full border border-[#E5E5E5] text-sm font-medium text-[#2D3436]/70 hover:border-[#FF7675]/40 hover:text-[#FF7675] transition-all cursor-default"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        {example}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom showcase - Example story concept */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white rounded-3xl p-10 shadow-2xl border-2 border-[#FFD166]/30 overflow-hidden">
            {/* Accent gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF7675] via-[#FFD166] to-[#6C5CE7]" />

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD166] to-[#FF7675] flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className="text-2xl font-bold text-[#2D3436] mb-2"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  Example: Your Story Seed
                </h3>
                <p className="text-[#2D3436]/60 text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
                  This is what you might create in seconds
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#6C5CE7]/10 rounded-lg text-sm font-semibold text-[#6C5CE7]" style={{ fontFamily: "var(--font-poppins)" }}>
                  Genre
                </span>
                <span className="text-[#2D3436]/80" style={{ fontFamily: "var(--font-nunito)" }}>
                  Sci-Fi Mystery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#00BFA6]/10 rounded-lg text-sm font-semibold text-[#00BFA6]" style={{ fontFamily: "var(--font-poppins)" }}>
                  Hero
                </span>
                <span className="text-[#2D3436]/80" style={{ fontFamily: "var(--font-nunito)" }}>
                  A curious AI researcher who discovers consciousness isn't what we think
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#FFD166]/10 rounded-lg text-sm font-semibold text-[#FFD166]" style={{ fontFamily: "var(--font-poppins)" }}>
                  Setting
                </span>
                <span className="text-[#2D3436]/80" style={{ fontFamily: "var(--font-nunito)" }}>
                  Neo-Tokyo, 2089 – where humans and AI coexist uneasily
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#FF7675]/10 rounded-lg text-sm font-semibold text-[#FF7675]" style={{ fontFamily: "var(--font-poppins)" }}>
                  Tone
                </span>
                <span className="text-[#2D3436]/80" style={{ fontFamily: "var(--font-nunito)" }}>
                  Cerebral thriller with moments of wonder
                </span>
              </div>
            </div>

            <motion.div
              className="mt-8 pt-6 border-t-2 border-[#E5E5E5]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[#2D3436]/60 text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
                  From seed to story in <span className="font-bold text-[#6C5CE7]">under 30 seconds</span>
                </p>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-2 text-[#6C5CE7] font-semibold"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Begin Creating
                  <Zap className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}