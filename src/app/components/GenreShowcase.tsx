"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
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

type Genre = {
  Icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient?: string;
  example: string;
  bgImage: string;
};

const genres: Genre[] = [
  {
    Icon: Sparkles,
    title: "Comedy",
    description: "Laugh-out-loud moments and witty adventures",
    color: "#FDCB6E",
    example: "When a clumsy wizard tries to open a bakery, chaos—and laughter—ensues...",
    bgImage: "/Genre_bg/Comedy1.png",
  },
  {
    Icon: Sword,
    title: "Fantasy",
    description: "Dragons, magic, and quests await in mystical realms",
    color: "#6C5CE7",
    example: "Forge alliances with elven kingdoms and battle ancient evils...",
    bgImage: "/Genre_bg/Fantasy1.png",
  },
  {
    Icon: Heart,
    title: "Romance",
    description: "Love stories that tug at your heartstrings",
    color: "#FF7675",
    example: "Two strangers meet on a rainy night, their destinies intertwined...",
    bgImage: "/Genre_bg/Romance3.png",
  },
  {
    Icon: Skull,
    title: "Horror",
    description: "Chilling tales that keep you on edge",
    color: "#2D3436",
    example: "The old house whispers secrets no one should ever hear...",
    bgImage: "/Genre_bg/Horror1.png",
  },
  {
    Icon: Rocket,
    title: "Sci-Fi",
    description: "Explore distant galaxies and futuristic worlds",
    color: "#74C0FC",
    example: "Your ship's AI has detected an anomaly in the space-time fabric...",
    bgImage: "/Genre_bg/Sci-fi1.png",
  },
  {
    Icon: Eye,
    title: "Mystery",
    description: "Unravel secrets and solve enigmatic puzzles",
    color: "#00BFA6",
    example: "The detective found a clue that changed everything...",
    bgImage: "/Genre_bg/Mystery1.png",
  },
  {
    Icon: Crown,
    title: "Suspense",
    description: "Edge-of-your-seat twists and psychological tension",
    color: "#FFD166",
    example: "Every phone call could reveal the truth—or destroy everything...",
    bgImage: "/Genre_bg/Suspense_1.png",
  },
  {
    Icon: Drama,
    title: "Slice of Life",
    description: "Real-life conflicts and emotional journeys",
    color: "#E17055",
    example: "I woke to sunlight streaming through the window, another ordinary morning—or so I thought...",
    bgImage: "/Genre_bg/Slice_of_life2.png",
  },
  {
    Icon: Sparkles,
    title: "Adventure",
    description: "Where the ordinary meets the extraordinary",
    color: "#A29BFE",
    example: "Ever since the flowers started singing, nothing was the same...",
    bgImage: "/Genre_bg/Adventure1.png",
  },
];

export default function GenreShowcase(): React.JSX.Element {

  const [activeGenre, setActiveGenre] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const active = genres[activeGenre];

  return (
    <section className="relative min-h-screen py-10 px-4 sm:px-6 flex flex-col justify-center overflow-visible ">
      {/* ---------- BACKGROUND (image element baked for reliable object-cover cropping) ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGenre}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* container ensures image always fills and crops (object-cover) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={active.bgImage}
              alt={`${active.title} background`}
              className="w-full h-full object-cover object-center"
              style={{
                // ensure GPU compositing and crisp cropping
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
              // prevent image from being selectable/dragged on mobile
              draggable={false}
            />
            {/* dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40" aria-hidden />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ---------- FLOATING BLOBS ---------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-20">
        <motion.div
          className="absolute top-16 right-6 sm:right-12 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(116,192,252,0.08)" }}
          animate={{ scale: [1, 1.25, 1], x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-8 left-6 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(108,92,231,0.06)" }}
          animate={{ scale: [1, 1.12, 1], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* ---------- Header ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/30 mb-3 shadow-md">
            <Sparkles className="w-4 h-4 text-[#74C0FC]" />
            <span className="text-xs font-semibold text-white">Endless Possibilities</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#FFF8F1] mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
            Every Genre,
            <span className="block mt-1 bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] bg-clip-text text-transparent text-4xl sm:text-6xl">
              Every Mood
            </span>
          </h2>

          <p className="text-sm sm:text-lg text-[#FFF8F1] max-w-2xl mx-auto px-2" style={{ fontFamily: "var(--font-nunito)" }}>
            From heart-pounding adventures to tender romances, Whimsera crafts stories in any genre you desire
          </p>
        </motion.div>

        {/* ---------- Genre buttons (scrollable on mobile) ---------- */}
<div className="w-full overflow-x-auto overflow-y-visible pb-3 mb-6 scrollbar-hide">
  <div className="flex gap-3 sm:gap-4 min-w-max items-center px-2 sm:px-4 py-6">
            {genres.map((g, i) => {
              const isActive = i === activeGenre;
              const Icon = g.Icon;
              return (
                <motion.button
                  key={g.title}
                  onClick={() => setActiveGenre(i)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.36, delay: i * 0.03 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative z-20 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap text-xs font-bold min-w-[92px] sm:min-w-[110px] overflow-visible`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${g.color}, ${g.color}cc)`
                      : `linear-gradient(135deg, ${g.color}33, ${g.color}18)`,
                    border: isActive ? `2px solid #FFF8F1` : `1px solid ${g.color}55`,
                    color: isActive ? "#2D3436" : "#FFF8F1",
                    transform: isActive ? "scale(1.07)" : undefined,
                    boxShadow: isActive ? `0 10px 30px ${g.color}40` : undefined,
                  }}
                  aria-pressed={isActive}
                >
                  {/* subtle radial glow behind active */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: isActive ? `0 30px 60px ${g.color}30` : undefined,
                    }}
                  />

                  <div
                    className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shadow"
                    style={{
                      background: isActive ? "#FFF8F1" : "rgba(255,248,241,0.15)",
                      boxShadow: isActive ? `0 10px 25px ${g.color}30` : "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: isActive ? g.color : "#FFF8F1" }} />
                  </div>

                  <span className="relative z-10 text-[10px] sm:text-xs uppercase tracking-wide">{g.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ---------- Active genre panel ---------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.title}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-xl sm:max-w-2xl mx-auto"
          >
            <div
              className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-[#F7F7F7] to-white border-2 shadow-2xl overflow-hidden"
              style={{ borderColor: `${active.color}55` }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${active.color}, transparent)` }}
                aria-hidden
              />

              <div className="relative z-10">
                <p className="text-base sm:text-xl font-medium text-[#2D3436] mb-4 text-center leading-relaxed" style={{ fontFamily: "var(--font-nunito)" }}>
                  {active.description}
                </p>

                <div
                  className="p-4 rounded-2xl border-2 bg-gradient-to-br from-white via-[#FFF8F1] to-white shadow-inner"
                  style={{ borderColor: `${active.color}40`, boxShadow: `0 6px 20px ${active.color}10` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${active.color}24, ${active.color}12)` }}
                    >
                      <active.Icon className="w-6 h-6" style={{ color: active.color }} />
                    </div>
                    <span className="font-bold text-[#2D3436]/70 text-sm tracking-wide" style={{ fontFamily: "var(--font-poppins)" }}>
                      Story Example
                    </span>
                  </div>

                  <p className="text-[#2D3436] italic leading-relaxed text-base sm:text-lg font-medium">
                    &quot;{active.example}&quot;
                  </p>
                </div>

                <motion.div
                  className="mt-5 text-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-[#2D3436]/65 text-sm mb-2">This is just the beginning...</p>
                  <motion.div
                    className="inline-flex items-center gap-2 text-sm font-bold"
                    style={{ color: active.color }}
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
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

      {/* ---------- hide default scrollbar for the button row ---------- */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
