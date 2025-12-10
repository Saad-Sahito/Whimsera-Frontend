"use client";

import React, { JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { forwardRef, useEffect } from "react";

const ALL_GENRES = [
  "Fantasy",
  "Mystery",
  "Comedy",
  "Sci-Fi",
  "Romance",
  "Adventure",
  "Horror",
  "Thriller/Suspense",
  "Crime",
  "Drama",
  "Tragedy"
];

// Genre age ratings
const GENRE_AGE_RATINGS: Record<string, string> = {
  "Romance": "A/T/M",
  "Thriller/Suspense": "T/M",
  "Mystery": "A/T",
  "Horror": "T/M",
  "Comedy": "A/T/M",
  "Drama": "A/T/M",
  "Tragedy": "T/M",
  "Adventure": "A/T",
  "Crime": "T/M",
  "Fantasy": "A/T/M",
  "Sci-Fi": "A/T/M"
};

// Sub-genre mappings with realistic age ratings (A = All ages, T = Teen 13+, M = Mature 17+)
const SUB_GENRES: Record<
  string,
  Array<{ name: string; rating: string }>
> = {
  "Thriller/Suspense": [
    { name: "Psychological Thriller", rating: "T/M" },
    { name: "Action Thriller", rating: "T/M" },
    { name: "Legal Thriller", rating: "T" },
    { name: "Domestic Thriller", rating: "T/M" },
    { name: "Conspiracy Thriller", rating: "T/M" },
    { name: "Spy/Espionage", rating: "T/M" },
    { name: "Medical Thriller", rating: "T/M" },
  ],
  "Mystery": [
    { name: "Cozy Mystery", rating: "A" },
    { name: "Whodunit", rating: "A/T" },
    { name: "Hard-Boiled", rating: "T/M" },
    { name: "Police Procedural", rating: "T" },
    { name: "Private Investigator", rating: "T/M" },
    { name: "Locked-Room", rating: "A/T" },
    { name: "Noir Mystery", rating: "M" },
    { name: "Caper/Heist Mystery", rating: "T" },
  ],
  "Horror": [
    { name: "Supernatural", rating: "T/M" },
    { name: "Psychological Horror", rating: "T/M" },
    { name: "Slasher", rating: "M" },
    { name: "Body Horror", rating: "M" },
    { name: "Folk Horror", rating: "T/M" },
    { name: "Cosmic/Lovecraftian", rating: "M" },
    { name: "Gothic Horror", rating: "T/M" },
    { name: "Zombie", rating: "M" },
  ],
  "Romance": [
    { name: "Contemporary Romance", rating: "A/T" },
    { name: "Historical Romance", rating: "A/T" },
    { name: "Paranormal Romance", rating: "T/M" },
    { name: "Romantic Suspense", rating: "T/M" },
    { name: "Romantic Comedy", rating: "A/T" },
    { name: "Sports Romance", rating: "T" },
    { name: "Dark Romance", rating: "M" },
    { name: "Fantasy Romance", rating: "T/M" },
  ],
  "Comedy": [
    { name: "Romantic Comedy", rating: "A/T" },
    { name: "Dark Comedy", rating: "M" },
    { name: "Satire", rating: "T/M" },
    { name: "Slapstick", rating: "A" },
    { name: "Buddy Comedy", rating: "A/T" },
    { name: "Screwball Comedy", rating: "A/T" },
    { name: "Parody", rating: "T" },
  ],
  "Drama": [
    { name: "Family Drama", rating: "T" },
    { name: "Coming-of-Age", rating: "A/T" },
    { name: "Psychological Drama", rating: "T/M" },
    { name: "Social Issue Drama", rating: "T/M" },
    { name: "Melodrama", rating: "T" },
    { name: "Historical Drama", rating: "T" },
  ],
  "Tragedy": [
    { name: "Classical Tragedy", rating: "T/M" },
    { name: "Revenge Tragedy", rating: "M" },
    { name: "Domestic Tragedy", rating: "T/M" },
    { name: "Modern Tragedy", rating: "T/M" },
    { name: "Shakespearean Tragedy", rating: "T/M" },
  ],
  "Adventure": [
    { name: "Swashbuckling", rating: "A/T" },
    { name: "Pulp Adventure", rating: "T" },
    { name: "Survival Adventure", rating: "T/M" },
    { name: "Jungle/Exploration", rating: "A/T" },
    { name: "High-Seas/Pirate", rating: "T" },
  ],
  "Crime": [
    { name: "Heist/Caper", rating: "T" },
    { name: "Police Procedural", rating: "T" },
    { name: "Noir", rating: "M" },
    { name: "Gangster/Mafia", rating: "M" },
    { name: "True Crime-Inspired", rating: "T/M" },
    { name: "Organized Crime", rating: "M" },
  ],
  "Fantasy": [
    { name: "High Fantasy", rating: "A/T" },
    { name: "Urban Fantasy", rating: "T/M" },
    { name: "Dark Fantasy", rating: "M" },
    { name: "Portal/Isekai", rating: "A/T" },
    { name: "Mythic/Fairy-Tale", rating: "A/T" },
    { name: "Grimdark", rating: "M" },
    { name: "Sword & Sorcery", rating: "T/M" },
  ],
  "Sci-Fi": [
    { name: "Space Opera", rating: "A/T" },
    { name: "Hard Sci-Fi", rating: "A/T" },
    { name: "Cyberpunk", rating: "M" },
    { name: "Dystopian", rating: "T/M" },
    { name: "Post-Apocalyptic", rating: "T/M" },
    { name: "Military Sci-Fi", rating: "T/M" },
    { name: "Time Travel", rating: "A/T" },
    { name: "First Contact", rating: "A/T" },
  ],
};

const genreColors: Record<string, string> = {
  Fantasy: "#6B4CE7",        // Vibrant purple (magic & wonder)
  "Sci-Fi": "#74C0FF",       // Cool future-blue
  Mystery: "#00BFA6",        // Teal (intrigue, clues, calm deduction)
  Comedy: "#FFD166",         // Sunny yellow (fun, laughter)
  Romance: "#FF7675",        // Warm coral-pink (love, passion)
  Adventure: "#00CEC9",      // Bright turquoise (exploration, sea & sky)
  Horror: "#E17055",            // Burnt orange-red (fear, blood, autumn nights)
  "Thriller/Suspense": "#0984E3", // Deep electric blue (tension, night)
  Tragedy: "#2D132C",        // Very dark purple/plum – mourning, fate, classical theater drapes
  Crime: "#2F3645",          // Gunmetal / charcoal gray – noir alleys, moral ambiguity, detective trench coats
  Drama: "#576574",          // Muted steel blue-gray – emotional weight, realism, human struggle
};

const povOptions = ["First-person", "Third-person limited"];
const toneLabels = ["Playful", "Lighthearted", "Adventurous", "Dramatic", "Serious", "Intense"];
const toneColors = ["#FFD166", "#74C0FC", "#00BFA6", "#6C5CE7", "#FF7675", "#2D3436"];
const lengthLabels = [
  "Short Long Story (7,500 - 15,000 words)",
  "Novelette (15,000 - 25,000 words)",
  "Novella (25,000 - 40,000 words)",
  "Novel Chapter (40,000 - 60,000 words)",
  "Full Novel (60,000 - 90,000 words)",
  "Epic / Series (90,000 - 150,000+ words)",
];

const ALL_THEMES = [
  "Friendship & Loyalty",
  "Betrayal & Redemption",
  "Courage & Sacrifice",
  "Power & Corruption",
  "Truth & Deception",
  "Hope & Despair",
  "Freedom & Control",
  "Identity & Self-Discovery"
];

interface FoundationSectionProps {
  expanded: boolean;
  toggleExpanded: () => void;
  scrollToNext: () => void;

  selectedGenres: string[];
  setSelectedGenres: (v: string[] | ((prev: string[]) => string[])) => void;

  selectedSubGenres: string[];
  setSelectedSubGenres: (v: string[] | ((prev: string[]) => string[])) => void;

  selectedThemes: string[];
  setSelectedThemes: (v: string[] | ((prev: string[]) => string[])) => void;

  setting: string;
  setSetting: (v: string) => void;

  tone: number;
  setTone: (v: number) => void;

  selectedPOV: string;
  setSelectedPOV: (v: string) => void;

  storyLength: number;
  setStoryLength: (v: number) => void;

  userAge: number | null;
}

// Helper function to check if genre/sub-genre is appropriate for user age
const isAgeAppropriate = (rating: string, userAge: number | null): boolean => {
  if (!userAge) return true; // Show all if age unknown
  
  const ratings = rating.split('/');
  
  if (userAge >= 18) return true; // Adults can see everything
  if (userAge >= 13) return ratings.includes('A') || ratings.includes('T'); // Teens see A and T
  return ratings.includes('A'); // Children see only A
};

// forwardRef: (props, ref) => JSX
const FoundationSection = forwardRef<HTMLDivElement, FoundationSectionProps>(
  (
    {
      expanded,
      toggleExpanded,
      scrollToNext,
      selectedGenres,
      setSelectedGenres,
      selectedSubGenres,
      setSelectedSubGenres,
      selectedThemes,
      setSelectedThemes,
      setting,
      setSetting,
      tone,
      setTone,
      selectedPOV,
      setSelectedPOV,
      storyLength,
      setStoryLength,
      userAge,
    },
    ref
  ): JSX.Element => {
    const toggleGenre = (g: string): void => {
      setSelectedGenres((prev: string[] = []) =>
        prev.includes(g)
          ? prev.filter((x) => x !== g)
          : prev.length < 3
          ? [...prev, g]
          : prev
      );
    };

    const toggleSubGenre = (sg: string): void => {
      setSelectedSubGenres((prev: string[] = []) =>
        prev.includes(sg)
          ? prev.filter((x) => x !== sg)
          : prev.length < 3
          ? [...prev, sg]
          : prev
      );
    };

    const handleMultiSelectThemes = (item: string) => {
      setSelectedThemes((prev: string[] = []) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item)
          : prev.length < 3
          ? [...prev, item]
          : prev
      );
    };

    // Get available sub-genres based on selected genres
    const availableSubGenres = selectedGenres.flatMap(genre => 
      SUB_GENRES[genre] || []
    ).filter(sg => isAgeAppropriate(sg.rating, userAge));

    // Filter genres by age appropriateness
    const ageAppropriateGenres = ALL_GENRES.filter(genre => 
      isAgeAppropriate(GENRE_AGE_RATINGS[genre], userAge)
    );

    // Auto-scroll when section expands
    useEffect(() => {
      if (expanded && ref && "current" in ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [expanded, ref]);

    return (
      <section ref={ref} className="max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7675] to-[#FFD166] rounded-3xl blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-[#E5E5E5]">
            {/* Header badge */}
            <motion.div
              className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2"
              whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white">
                <span className="text-xs sm:text-sm font-bold block" style={{ fontFamily: "Poppins, sans-serif" }}>
                  CHAPTER 1
                </span>
                <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  The Foundation
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
                  Story Details
                </span>
                {expanded ? <ChevronUp className="text-[#FF7675]" /> : <ChevronDown className="text-[#FF7675]" />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-8 sm:space-y-12"
                  >
                    {/* Genres */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What kind of tale calls to you?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Choose up to three genres to blend
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
                        {ageAppropriateGenres.map((g) => (
                          <motion.button
                            key={g}
                            onClick={() => toggleGenre(g)}
                            className={`rounded-2xl py-2 sm:py-3 px-3 sm:px-4 text-white font-bold text-sm sm:text-lg shadow-lg transition-all ${
                              selectedGenres?.includes(g) ? "ring-4 ring-yellow-400" : ""
                            }`}
                            style={{ backgroundColor: genreColors[g], fontFamily: "Fredoka, sans-serif" }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            animate={selectedGenres?.includes(g) ? { rotate: [0, -3, 3, 0] } : {}}
                          >
                            {g}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Sub-Genres (Dynamic based on selected genres) */}
                    {availableSubGenres.length > 0 && (
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                          Choose your flavor
                        </h3>
                        <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                          Select up to three sub-genres
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                          {availableSubGenres.map((sg) => (
                            <motion.button
                              key={sg.name}
                              onClick={() => toggleSubGenre(sg.name)}
                              className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 font-semibold text-xs sm:text-sm ${
                                selectedSubGenres?.includes(sg.name)
                                  ? "bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white border-white shadow-lg"
                                  : "border-[#FF7675] text-[#2D3436] bg-white/80 hover:border-[#FF7675] hover:bg-[#FF7675]/10"
                              }`}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {sg.name}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Themes */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        What threads will weave through?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Select up to three themes
                      </p>
                      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                        {ALL_THEMES.map((t) => (
                          <motion.button
                            key={t}
                            onClick={() => handleMultiSelectThemes(t)}
                            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 font-semibold text-xs sm:text-sm ${
                              selectedThemes?.includes(t)
                                ? "bg-gradient-to-r from-[#FFD166] to-[#74C0FC] text-[#2D3436] border-white shadow-lg"
                                : "border-[#FFD166] text-[#2D3436] bg-white/80 hover:border-[#FFD166] hover:bg-[#FFD166]/10"
                            }`}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {t}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Setting */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        Where will your story unfold?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-4 sm:mb-6 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Paint your world with words
                      </p>
                      <motion.textarea
                        rows={4}
                        placeholder="A mystical forest where ancient trees whisper secrets..."
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        className="w-full border-3 border-[#6C5CE7] rounded-2xl p-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#00BFA6] bg-white/80 backdrop-blur-sm shadow-lg text-[#2D3436]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    {/* Tone */}
<div className="max-w-3xl mx-auto">
  <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
    What mood shall enchant your tale?
  </h3>
  <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
    From playful to intense
  </p>
  <input
    type="range"
    min="0"
    max="100"
    step="20"
    value={tone}
    onChange={(e) => setTone(Number(e.target.value))}
    className="w-full h-3 rounded-full appearance-none cursor-pointer"
    style={{
      background: `linear-gradient(to right, ${toneColors.join(", ")})`,
    }}
  />

  {/* Mobile: show only the active label | Desktop: show all labels */}
  <div className="mt-4 sm:mt-6">
    {/* Desktop view – all labels */}
    <div className="hidden sm:flex justify-between">
      {toneLabels.map((lbl, i) => (
        <motion.span
          key={i}
          className={`text-center font-bold text-xs sm:text-sm ${tone === i * 20 ? "scale-125" : ""}`}
          style={{ color: toneColors[i], fontFamily: "Fredoka, sans-serif" }}
          animate={tone === i * 20 ? { y: [0, -5, 0] } : {}}
        >
          {lbl}
        </motion.span>
      ))}
    </div>

    {/* Mobile view – only the current label */}
    <div className="sm:hidden text-center">
      <motion.span
        key={tone} // forces re-animation when value changes
        className="inline-block font-bold text-lg text-[#2D3436]"
        style={{ color: toneColors[tone / 20], fontFamily: "Fredoka, sans-serif" }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
      >
        {toneLabels[tone / 20]}
      </motion.span>
    </div>
  </div>
</div>


                    {/* POV */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        Through whose eyes shall we see?
                      </h3>
                      <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Choose your narrative perspective
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                        {povOptions.map((opt) => (
                          <motion.button
                            key={opt}
                            onClick={() => setSelectedPOV(opt)}
                            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-full border-3 transition-all text-xs sm:text-sm font-semibold ${
                              selectedPOV === opt
                                ? "bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white border-white shadow-lg"
                                : "border-[#FF7675] text-[#2D3436] bg-white/80 hover:border-[#FF7675] hover:bg-[#FF7675]/10"
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

                    
{/* Length */}
<div className="max-w-3xl mx-auto">
  <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
    How epic shall your journey be?
  </h3>
  <p className="text-center text-[#2D3436] mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
    From a quick tale to an endless saga
  </p>
  <input
    type="range"
    min="0"
    max="100"
    step="20"
    value={storyLength}
    onChange={(e) => setStoryLength(Number(e.target.value))}
    className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-[#FF7675] to-[#FFD166] cursor-pointer"
  />

  {/* Mobile: show only the active label | Desktop: show all labels */}
  <div className="mt-4 sm:mt-6">
    {/* Desktop view – all labels */}
    <div className="hidden sm:flex justify-between">
      {lengthLabels.map((lbl, i) => (
        <motion.span
          key={i}
          className={`text-center font-bold text-xs ${storyLength === i * 20 ? "scale-125 text-[#FF7675]" : "text-[#2D3436] opacity-50"}`}
          style={{ fontFamily: "Fredoka, sans-serif" }}
          animate={storyLength === i * 20 ? { y: [0, -5, 0] } : {}}
        >
          {lbl}
        </motion.span>
      ))}
    </div>

    {/* Mobile view – only the current label */}
    <div className="sm:hidden text-center">
      <motion.span
        key={storyLength}
        className="inline-block font-bold text-lg text-[#FF7675]"
        style={{ fontFamily: "Fredoka, sans-serif" }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
      >
        {lengthLabels[storyLength / 20]}
      </motion.span>
    </div>
  </div>
</div>

                    {/* Mobile next button */}
                    <div className="lg:hidden flex justify-center mt-8">
                      <motion.button
                        onClick={scrollToNext}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white rounded-full font-bold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next to Magic
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

// Required for React DevTools
FoundationSection.displayName = "FoundationSection";

export default FoundationSection;