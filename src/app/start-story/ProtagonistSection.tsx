"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { forwardRef, useEffect } from "react";

const GENDER_OPTIONS = ["Male", "Female"];
const ARCHETYPE_OPTIONS = [
  "Reluctant Hero",
  "Mentor",
  "Underdog",
  "Chosen One",
  "Anti-Hero",
  "Ordinary Person",
  "Trickster",
  "Let AI decide",
];

interface ProtagonistSectionProps {
  expanded: boolean;
  toggleExpanded: () => void;
  skipProtagonist: () => void;
  scrollToNext: () => void;

  // ----- protagonist fields -----
  protagonistName: string;
  setProtagonistName: (v: string) => void;

  protagonistAge: number | null;
  setProtagonistAge: (v: number | null) => void;

  protagonistGender: string;
  setProtagonistGender: (v: string) => void;

  protagonistArchetype: string;
  setProtagonistArchetype: (v: string) => void;

  protagonistTrait: string;
  setProtagonistTrait: (v: string) => void;

  protagonistBackground: string;
  setProtagonistBackground: (v: string) => void;

  protagonistDesire: string;
  setProtagonistDesire: (v: string) => void;

  protagonistFear: string;
  setProtagonistFear: (v: string) => void;

  protagonistRelationships: string;
  setProtagonistRelationships: (v: string) => void;

  protagonistPhysicalDescription: string;
  setProtagonistPhysicalDescription: (v: string) => void;

  filledCount: number;
  totalFields: number;
}

// forwardRef: (props, ref) => JSX
const ProtagonistSection = forwardRef<HTMLDivElement, ProtagonistSectionProps>(
  (
    {
      expanded,
      toggleExpanded,
      skipProtagonist,
      scrollToNext,
      protagonistName,
      setProtagonistName,
      protagonistAge,
      setProtagonistAge,
      protagonistGender,
      setProtagonistGender,
      protagonistArchetype,
      setProtagonistArchetype,
      protagonistTrait,
      setProtagonistTrait,
      protagonistBackground,
      setProtagonistBackground,
      protagonistDesire,
      setProtagonistDesire,
      protagonistFear,
      setProtagonistFear,
      protagonistRelationships,
      setProtagonistRelationships,
      protagonistPhysicalDescription,
      setProtagonistPhysicalDescription,
      filledCount,
      totalFields,
    },
    ref // This is the forwarded ref
  ) => {
    // Auto-scroll when expanded
    useEffect(() => {
      if (expanded && ref && "current" in ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [expanded, ref]);

    return (
      <section ref={ref} className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] rounded-3xl blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl border-4 border-[#E5E5E5]">
            {/* Header badge */}
            <motion.div
              className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white">
                <span className="text-xs sm:text-sm font-bold block" style={{ fontFamily: "Poppins, sans-serif" }}>
                  CHAPTER 1
                </span>
                <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  The Protagonist
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
                  Character Details
                </span>
                {expanded ? <ChevronUp className="text-[#6C5CE7]" /> : <ChevronDown className="text-[#6C5CE7]" />}
              </button>

              {/* Progress */}
              <div className="mb-6 pb-6 border-b border-[#E5E5E5]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#2D3436]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {filledCount}/{totalFields} character details filled
                  </p>
                  <button
                    onClick={skipProtagonist}
                    className="text-xs sm:text-sm text-[#6C5CE7] hover:text-[#00BFA6] underline flex items-center gap-1"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Skip – Let AI create Protagonist
                  </button>
                </div>
                <div className="w-full bg-[#E5E5E5] h-2 rounded-full">
                  <div
                    className="bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(filledCount / totalFields) * 100}%` }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-8 sm:space-y-12"
                  >
                    {/* ---------- Name ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        Who is your hero?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Name your protagonist
                      </p>
                      <motion.input
                        type="text"
                        placeholder="Elara the Brave..."
                        value={protagonistName}
                        onChange={(e) => setProtagonistName(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* ---------- Age ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        How old is your protagonist?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Enter an age
                      </p>
                      <motion.input
                        type="number"
                        placeholder="25"
                        value={protagonistAge ?? ""}
                        onChange={(e) => setProtagonistAge(e.target.value ? Number(e.target.value) : null)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* ---------- Gender ---------- */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What is their gender?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Select a gender
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                        {GENDER_OPTIONS.map((opt) => (
                          <motion.button
                            key={opt}
                            onClick={() => setProtagonistGender(opt)}
                            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 transition-all text-xs sm:text-sm font-semibold ${
                              protagonistGender === opt
                                ? "bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white border-white shadow-lg"
                                : "border-[#6C5CE7] text-[#2D3436] bg-white/80 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/10"
                            }`}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* ---------- Archetype ---------- */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What archetype fits them?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Select an archetype
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                        {ARCHETYPE_OPTIONS.map((opt) => (
                          <motion.button
                            key={opt}
                            onClick={() => setProtagonistArchetype(opt)}
                            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 transition-all text-xs sm:text-sm font-semibold ${
                              protagonistArchetype === opt
                                ? "bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white border-white shadow-lg"
                                : "border-[#6C5CE7] text-[#2D3436] bg-white/80 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/10"
                            }`}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* ---------- Core Trait ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What is their core trait?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        e.g. Curious, Courageous, Cynical…
                      </p>
                      <motion.input
                        type="text"
                        placeholder="Curious"
                        value={protagonistTrait}
                        onChange={(e) => setProtagonistTrait(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* ---------- Background ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What is their background?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Where did they grow up? What shaped them?
                      </p>
                      <motion.textarea
                        rows={4}
                        placeholder="Raised in a small village, orphaned at a young age..."
                        value={protagonistBackground}
                        onChange={(e) => setProtagonistBackground(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* ---------- Relationships ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What important relationships do they have?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        e.g. younger sister, wise old wizard…
                      </p>
                      <motion.textarea
                        rows={4}
                        placeholder="Has a younger sister they protect, mentor is a wise old wizard..."
                        value={protagonistRelationships}
                        onChange={(e) => setProtagonistRelationships(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* ---------- Desire ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What do they desire most?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Internal or external goal
                      </p>
                      <motion.input
                        type="text"
                        placeholder="To find the lost artifact..."
                        value={protagonistDesire}
                        onChange={(e) => setProtagonistDesire(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                      {protagonistDesire && !protagonistFear && (
                        <p className="text-xs text-[#FFD166] mt-2 flex items-center gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                          Tip: Pairing desires with fears creates richer depth!
                        </p>
                      )}
                    </div>

                    {/* ---------- Fear ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What do they fear?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Their deepest fear
                      </p>
                      <motion.input
                        type="text"
                        placeholder="Abandonment by loved ones..."
                        value={protagonistFear}
                        onChange={(e) => setProtagonistFear(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                      {protagonistFear && !protagonistDesire && (
                        <p className="text-xs text-[#FFD166] mt-2 flex items-center gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                          Tip: Adding a desire will make the conflict stronger!
                        </p>
                      )}
                    </div>

                    {/* ---------- Physical Description ---------- */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What do they look like?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Physical description
                      </p>
                      <motion.textarea
                        rows={4}
                        placeholder="Tall with silver hair and piercing green eyes..."
                        value={protagonistPhysicalDescription}
                        onChange={(e) => setProtagonistPhysicalDescription(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* Bottom navigation (mobile) */}
                    <div className="lg:hidden flex justify-center mt-8">
                      <motion.button
                        onClick={scrollToNext}
                        className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] text-white rounded-full font-bold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next to Foundation
                      </motion.button>
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

// Required for debugging and React DevTools
ProtagonistSection.displayName = "ProtagonistSection";

export default ProtagonistSection;