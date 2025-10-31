"use client";
import { useState, useEffect } from "react";
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
    Icon: Sparkles,
    title: "Comedy",
    description: "Laugh-out-loud moments and witty adventures",
    color: "#FDCB6E",
    gradient: "from-[#FDCB6E] to-[#FFEAA7]",
    example:
      "When a clumsy wizard tries to open a bakery, chaos—and laughter—ensues...",
    bgImage: "/Genre_bg/Comedy1.jpeg",
  },
  {
    Icon: Sword,
    title: "Fantasy",
    description: "Dragons, magic, and quests await in mystical realms",
    color: "#6C5CE7",
    gradient: "from-[#6C5CE7] to-[#8B7FE8]",
    example:
      "Forge alliances with elven kingdoms and battle ancient evils...",
    bgImage: "/Genre_bg/Fantasy1.jpeg",
  },
  {
    Icon: Heart,
    title: "Romance",
    description: "Love stories that tug at your heartstrings",
    color: "#FF7675",
    gradient: "from-[#FF7675] to-[#FF9B9A]",
    example:
      "Two strangers meet on a rainy night, their destinies intertwined...",
    bgImage: "/Genre_bg/Romance3.jpeg",
  },
  {
    Icon: Skull,
    title: "Horror",
    description: "Chilling tales that keep you on edge",
    color: "#2D3436",
    gradient: "from-[#2D3436] to-[#636E72]",
    example:
      "The old house whispers secrets no one should ever hear...",
    bgImage: "/Genre_bg/Horror1.jpeg",
  },
  {
    Icon: Rocket,
    title: "Sci-Fi",
    description: "Explore distant galaxies and futuristic worlds",
    color: "#74C0FC",
    gradient: "from-[#74C0FC] to-[#4DABF7]",
    example:
      "Your ship's AI has detected an anomaly in the space-time fabric...",
    bgImage: "/Genre_bg/Sci-fi1.jpeg",
  },
  {
    Icon: Eye,
    title: "Mystery",
    description: "Unravel secrets and solve enigmatic puzzles",
    color: "#00BFA6",
    gradient: "from-[#00BFA6] to-[#00D4B5]",
    example: "The detective found a clue that changed everything...",
    bgImage: "/Genre_bg/Mystery.png",
  },
  {
    Icon: Crown,
    title: "Suspense",
    description: "Edge-of-your-seat twists and psychological tension",
    color: "#FFD166",
    gradient: "from-[#FFD166] to-[#FFE066]",
    example:
      "Every phone call could reveal the truth—or destroy everything...",
    bgImage: "/Genre_bg/Suspense.png",
  },
  {
    Icon: Drama,
    title: "Slice of Life",
    description: "Real-life conflicts and emotional journeys",
    color: "#E17055",
    gradient: "from-[#E17055] to-[#E88E76]",
    example:
      "A typical day at school, until I realized something incredible...",
    bgImage: "/Genre_bg/Slice_of_life1.jpeg",
  },
  {
    Icon: Sparkles,
    title: "Adventure",
    description: "Where the ordinary meets the extraordinary",
    color: "#A29BFE",
    gradient: "from-[#A29BFE] to-[#B8B3FF]",
    example:
      "Ever since the flowers started singing, nothing was the same...",
    bgImage: "/Genre_bg/Adventure1.jpeg",
  },
];

export default function GenreShowcase() {
  const [activeGenre, setActiveGenre] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen py-12 px-6 overflow-hidden flex flex-col justify-center">
      {/* ---------- BACKGROUND IMAGE ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGenre}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${genres[activeGenre].bgImage})`,
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* ---------- FLOATING BLOBS ---------- */}
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

      <div className="relative max-w-7xl mx-auto flex flex-col items-center">
        {/* ---------- HEADER ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border-2 border-[#74C0FC]/40 mb-4 shadow-md"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-[#74C0FC]" />
            <span className="text-sm font-bold text-[#FFFFFF]">
              Endless Possibilities
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#FFF8F1] mb-3"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Every Genre,
            <span className="block mt-1 bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166] bg-clip-text text-transparent text-5xl md:text-6xl">
              Every Mood
            </span>
          </h2>
          <p
            className="text-lg text-[#FFF8F1] max-w-2xl mx-auto font-medium"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            From heart-pounding adventures to tender romances, Whimsera crafts
            stories in any genre you desire
          </p>
        </motion.div>

        {/* ---------- GENRE BUTTONS – COLORED + OVERFLOW GLOW ---------- */}
        <div className="!overflow-visible w-full pb-3 mb-6 scrollbar-hide">
          <div className="flex gap-3 min-w-max justify-center items-center px-4 !overflow-visible">
            {genres.map((genre, i) => {
              const Icon = genre.Icon;
              const isActive = activeGenre === i;

              return (
                <motion.button
                  key={i}
                  onClick={() => setActiveGenre(i)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 1,
                    y: -4 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
  relative z-20 flex flex-col items-center gap-2 px-5 py-4 
  rounded-2xl transition-all duration-500 whitespace-nowrap 
  text-xs font-bold min-w-[110px] shadow-xl 
  focus:outline-none focus:ring-2 focus:ring-offset-2
  ${isActive ? `ring-2 ring-white/50 scale-110` : `hover:scale-105`}
  ${isActive ? `ring-[${genre.color}]` : ''}   // Tailwind arbitrary value
`}
style={{
  background: isActive 
    ? `linear-gradient(135deg, ${genre.color}, ${genre.color}cc)` 
    : `linear-gradient(135deg, ${genre.color}dd, ${genre.color}88)`,
  border: isActive 
    ? `2px solid #FFF8F1` 
    : `1px solid ${genre.color}80`,
  color: isActive ? '#2D3436' : '#FFF8F1',
}}
                >
                  {/* ========== OVERFLOW GLOW (SPILLS OUT) ========== */}
                  <motion.div
                    layoutId="activeGlow"
                    className={`
                      absolute inset-0 -z-10 rounded-2xl blur-2xl 
                      pointer-events-none !overflow-visible
                      ${isActive ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{
                      background: `radial-gradient(circle at center, ${genre.color}80 0%, ${genre.color}40 50%, transparent 70%)`,
                      filter: 'blur(24px)',
                      scale: 1.3,
                      transformOrigin: 'center',
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25 
                    }}
                  />

                  {/* ========== ICON ========== */}
                  <motion.div
                    className="relative z-30 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: isActive 
                        ? '#FFF8F1' 
                        : `rgba(255, 248, 241, 0.2)`,
                      boxShadow: isActive 
                        ? `0 0 25px ${genre.color}80` 
                        : `0 4px 12px rgba(0,0,0,0.15)`,
                    }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ 
                        color: isActive ? genre.color : '#FFF8F1' 
                      }} 
                    />
                  </motion.div>

                  {/* ========== TITLE ========== */}
                  <span
                    className="relative z-30 text-xs font-bold uppercase tracking-wide"
                    style={{ 
                      textShadow: isActive ? '0 1px 2px rgba(255, 255, 255, 0.43)' : 'none' 
                    }}
                  >
                    {genre.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ---------- ACTIVE GENRE DISPLAY ---------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGenre}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div
              className="relative bg-gradient-to-br from-[#E5E5E5] to-white rounded-2xl p-7 shadow-2xl border-2 overflow-hidden"
              style={{ borderColor: genres[activeGenre].color + "60" }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${genres[activeGenre].color}, transparent)`,
                }}
              />
              <div className="relative z-10">
                <p
                  className="text-xl font-medium text-[#2D3436] mb-6 text-center leading-relaxed"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {genres[activeGenre].description}
                </p>

                <div
                  className="p-5 rounded-2xl border-2 bg-gradient-to-br from-white via-[#FFF8F1] to-white shadow-inner"
                  style={{
                    borderColor: genres[activeGenre].color + "40",
                    boxShadow: `0 4px 15px ${genres[activeGenre].color}15`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${genres[activeGenre].color}30, ${genres[activeGenre].color}15)`,
                      }}
                    >
                      {(() => {
                        const Icon = genres[activeGenre].Icon;
                        return (
                          <Icon
                            className="w-6 h-6"
                            style={{ color: genres[activeGenre].color }}
                          />
                        );
                      })()}
                    </div>
                    <span
                      className="font-bold text-[#2D3436]/70 text-sm tracking-wide"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Story Example
                    </span>
                  </div>
                  <p
                    className="text-[#2D3436] italic leading-relaxed text-lg font-medium drop-shadow-sm"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    &quot;{genres[activeGenre].example}&quot;
                  </p>
                </div>

                <motion.div
                  className="mt-7 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p
                    className="text-[#2D3436]/65 text-sm mb-2"
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

      {/* ---------- SCROLLBAR HIDE ---------- */}
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