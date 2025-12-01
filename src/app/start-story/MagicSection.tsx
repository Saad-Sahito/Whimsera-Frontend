"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { forwardRef, useEffect } from "react";

const voiceOptions = [
  "Casual / Conversational",
  "Fairy Tale",
  "Action-driven",
  "Descriptive / Immersive",
  "Concise / Minimalist",
  "Cinematic / Visual",
  "Witty / Playful",
  "Epic / Grand",
  "Introspective / Reflective",
  "Narrative / Classic Prose",
  "Folkloric / Oral Tradition",
];

interface MagicSectionProps {
  expanded: boolean;
  toggleExpanded: () => void;

  selectedVoice: string;
  setSelectedVoice: (v: string) => void;

  title: string;
  setTitle: (v: string) => void;

  isLoadingTitle: boolean;
  generateTitle: () => Promise<void>;
}

// forwardRef: (props, ref) => JSX
const MagicSection = forwardRef<HTMLDivElement, MagicSectionProps>(
  (
    {
      expanded,
      toggleExpanded,
      selectedVoice,
      setSelectedVoice,
      title,
      setTitle,
      isLoadingTitle,
      generateTitle,
    },
    ref
  ) => {
    // Auto-scroll into view when expanded
    useEffect(() => {
      if (expanded && ref && "current" in ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [expanded, ref]);

    return (
      <section ref={ref} className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4 mb-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD166] to-[#74C0FC] rounded-3xl blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-[#E5E5E5]">
            {/* Header badge */}
            <motion.div
              className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white">
                <span className="text-xs sm:text-sm font-bold block" style={{ fontFamily: "Poppins, sans-serif" }}>
                  CHAPTER 3
                </span>
                <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  The Magic
                </span>
              </div>
            </motion.div>

            <div className="mt-12 sm:mt-16">
              {/* Mobile toggle */}
              <button
                onClick={toggleExpanded}
                className="lg:hidden w-full flex items-center justify-between mb-6 p-3 bg-[#FFF8F1] rounded-xl"
              >
                <span className="text-lg font-bold text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  Final Touches
                </span>
                {expanded ? <ChevronUp className="text-[#FFD166]" /> : <ChevronDown className="text-[#FFD166]" />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-8 sm:space-y-12"
                  >
                    {/* Voice */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What voice will guide the prose?
                      </h3>
                      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                        {voiceOptions.map((v) => (
                          <motion.button
                            key={v}
                            onClick={() => setSelectedVoice(v)}
                            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 transition-all font-semibold text-xs sm:text-sm ${
                              selectedVoice === v
                                ? "bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-[#2D3436] border-white shadow-lg"
                                : "border-[#FFD166] text-[#2D3436] bg-white/80 hover:border-[#FFD166] hover:bg-[#FFD166]/10"
                            }`}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {v}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="max-w-2xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What name shall crown your tale?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-4 sm:mb-6 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Enter a title or let AI decide later
                      </p>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="The Chronicles of..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoadingTitle}
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border-3 border-[#FFD166] focus:outline-none focus:ring-4 focus:ring-[#74C0FC] text-base sm:text-lg font-semibold bg-white/80 backdrop-blur-sm shadow-lg pr-14 text-[#2D3436]"
                            style={{ fontFamily: "Fredoka, sans-serif" }}
                          />
                          {isLoadingTitle && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <motion.div
                                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD166] to-[#74C0FC] shadow-lg"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  rotate: [0, 360],
                                }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

// Required for React DevTools
MagicSection.displayName = "MagicSection";

export default MagicSection;