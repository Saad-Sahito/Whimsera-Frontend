"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sword,
  Heart,
  Skull,
  Rocket,
  Crown,
  Sparkles,
  Eye,
  Drama,
} from "lucide-react";

const genres = [
  {
    Icon: Sword,
    title: "Epic Fantasy",
    description: "Dragons, magic, and quests await in mystical realms",
    color: "#6C5CE7",
    gradient: "from-[#6C5CE7] to-[#8B7FE8]",
    example:
      "Forge alliances with elven kingdoms and battle ancient evils...",
    bgImage: "/bg/fantasy.jpg", // <-- replace with your image
  },
  {
    Icon: Heart,
    title: "Romance",
    description: "Love stories that tug at your heartstrings",
    color: "#FF7675",
    gradient: "from-[#FF7675] to-[#FF9B9A]",
    example:
      "Two strangers meet on a rainy night, their destinies intertwined...",
    bgImage: "/bg/romance.jpg",
  },
  {
    Icon: Skull,
    title: "Horror",
    description: "Chilling tales that keep you on edge",
    color: "#2D3436",
    gradient: "from-[#2D3436] to-[#636E72]",
    example:
      "The old house whispers secrets no one should ever hear...",
    bgImage: "/bg/horror.jpg",
  },
  {
    Icon: Rocket,
    title: "Sci-Fi",
    description: "Explore distant galaxies and futuristic worlds",
    color: "#74C0FC",
    gradient: "from-[#74C0FC] to-[#4DABF7]",
    example:
      "Your ship's AI has detected an anomaly in the space-time fabric...",
    bgImage: "/bg/scifi.jpg",
  },
  {
    Icon: Eye,
    title: "Mystery",
    description: "Unravel secrets and solve enigmatic puzzles",
    color: "#00BFA6",
    gradient: "from-[#00BFA6] to-[#00D4B5]",
    example: "The detective found a clue that changed everything...",
    bgImage: "/bg/mystery.jpg",
  },
  {
    Icon: Crown,
    title: "Historical",
    description: "Step into the past and witness history unfold",
    color: "#FFD166",
    gradient: "from-[#FFD166] to-[#FFE066]",
    example:
      "In the court of Queen Elizabeth, intrigue and power collide...",
    bgImage: "/bg/historical.jpg",
  },
  {
    Icon: Drama,
    title: "Drama",
    description: "Real-life conflicts and emotional journeys",
    color: "#E17055",
    gradient: "from-[#E17055] to-[#E88E76]",
    example:
      "A family secret surfaces, threatening to tear them apart...",
    bgImage: "/bg/drama.jpg",
  },
  {
    Icon: Sparkles,
    title: "Magical Realism",
    description: "Where the ordinary meets the extraordinary",
    color: "#A29BFE",
    gradient: "from-[#A29BFE] to-[#B8B3FF]",
    example:
      "Ever since the flowers started singing, nothing was the same...",
    bgImage: "/bg/magical-realism.jpg",
  },
];

export default function GenreShowcase() {
  const [activeGenre, setActiveGenre] = useState(0);

  return (
    <section className="relative min-h-screen py-24 px-6 overflow-hidden">
      {/* ---------- BACKGROUND IMAGE (changes with genre) ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGenre}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Placeholder image – replace the src with your own */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${genres[activeGenre].bgImage})`,
            }}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* ---------- FLOATING DECORATIVE BLOBS (unchanged) ---------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-[#74C0FC]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-80 h-80 bg-[#6C5CE7]/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ---------- HEADER (unchanged) ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border-2 border-[#74C0FC]/30 mb-6 shadow-sm"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-[#74C0FC]" />
            <span className="text-sm font-bold text-[#2D3436]">
              Endless Possibilities
            </span>
          </motion.div>

          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Every Genre,
            <span className="block mt-2 bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] bg-clip-text text-transparent text-5xl md:text-6xl">
              Every Mood
            </span>
          </h2>

          <p
            className="text-lg text-[#2D3436]/75 max-w-2xl mx-auto font-medium"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            From heart-pounding adventures to tender romances, Whimsera crafts
            stories in any genre you desire
          </p>
        </motion.div>

        {/* ---------- GENRE GRID (unchanged) ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {genres.map((genre, i) => {
            const Icon = genre.Icon;
            const isActive = activeGenre === i;

            return (
              <motion.button
                key={i}
                onClick={() => setActiveGenre(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative p-6 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-2xl border-2"
                    : "bg-white/50 backdrop-blur-sm border border-[#E5E5E5] hover:bg-white/80"
                }`}
                style={{
                  borderColor: isActive ? genre.color : undefined,
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 rounded-2xl blur-xl opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${genre.color}, transparent)`,
                    }}
                    layoutId="activeGlow"
                  />
                )}

                <div className="relative">
                  <motion.div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all ${
                      isActive ? "scale-110" : ""
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${genre.color}30, ${genre.color}15)`
                        : `${genre.color}20`,
                      boxShadow: isActive
                        ? `0 0 20px ${genre.color}40`
                        : "none",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: genre.color }}
                    />
                  </motion.div>

                  <h3
                    className={`text-base font-bold transition-all ${
                      isActive ? "text-[#2D3436]" : "text-[#2D3436]/70"
                    }`}
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {genre.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ---------- ACTIVE GENRE DISPLAY (unchanged) ---------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGenre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div
              className="relative bg-white rounded-3xl p-10 shadow-2xl border-2 overflow-hidden"
              style={{ borderColor: genres[activeGenre].color }}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${genres[activeGenre].color}, transparent)`,
                }}
              />

              <div className="relative">
                <p
                  className="text-xl text-[#2D3436]/80 mb-6 text-center leading-relaxed"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {genres[activeGenre].description}
                </p>

                <div
                  className="p-6 rounded-2xl border-2 bg-gradient-to-br from-white to-transparent"
                  style={{
                    borderColor: `${genres[activeGenre].color}30`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${genres[activeGenre].color}25, ${genres[activeGenre].color}10)`,
                      }}
                    >
                      {(() => {
                        const Icon = genres[activeGenre].Icon;
                        return (
                          <Icon
                            className="w-5 h-5"
                            style={{ color: genres[activeGenre].color }}
                          />
                        );
                      })()}
                    </div>
                    <span
                      className="font-semibold text-[#2D3436]/60 text-sm"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Story Example
                    </span>
                  </div>

                  <p
                    className="text-[#2D3436]/80 italic leading-relaxed text-lg"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    "{genres[activeGenre].example}"
                  </p>
                </div>

                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p
                    className="text-[#2D3436]/60 text-sm mb-3"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    This is just the beginning...
                  </p>
                  <motion.div
                    className="inline-flex items-center gap-2 text-sm font-bold"
                    style={{
                      color: genres[activeGenre].color,
                      fontFamily: "var(--font-poppins)",
                    }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Your choices shape the adventure
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}