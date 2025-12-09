"use client";

import { CheckCircle2, Zap, Globe, Users, Network, Layers, Shield, FileText, Sparkles, Wand2, User, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarRightDashboard from "../components/NavbarRightDashboard";
import Footer from "../components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtagonistSection from "./ProtagonistSection";
import FoundationSection from "./FoundationSection";
import MagicSection from "./MagicSection";
import StoryCreationPhases from "./StoryCreationPhases"; 

const GRADIENT_COLORS = [
  "rgba(108, 92, 231, 0.3)",
  "rgba(0, 191, 166, 0.3)",
  "rgba(255, 118, 117, 0.3)",
  "rgba(255, 209, 102, 0.3)",
  "rgba(116, 192, 252, 0.3)",
];

export default function StartStory() {
  // ---------- Auth ----------
  const { isAuthenticated, userId, accessToken, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // ---------- Global UI ----------
  const [showStoryTypePopup, setShowStoryTypePopup] = useState(false);
  const [storyType, setStoryType] = useState<"interactive" | "classic">("classic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [showCharacterPreview, setShowCharacterPreview] = useState(false);

  // ---------- Phase Modal ----------
  const [showPhases, setShowPhases] = useState(false);

  // ---------- Ripple effect ----------
  const ripples = useRef<
    { id: number; x: number; y: number; colorPair: [string, string] }[]
  >([]);
  const rippleCounter = useRef(0);
  const colorIndex = useRef(0);
  const lastMoveTime = useRef(Date.now());
  const lastColorChangeTime = useRef(Date.now());

  // ---------- Section expansion ----------
  const [expandedSections, setExpandedSections] = useState({
    protagonist: true,
    foundation: true,
    magic: true,
  });
  const toggleSection = (sec: "protagonist" | "foundation" | "magic") =>
    setExpandedSections((p) => ({ ...p, [sec]: !p[sec] }));

  // ---------- Refs for scrolling ----------
  const protagonistRef = useRef<HTMLDivElement>(null);
  const foundationRef = useRef<HTMLDivElement>(null);
  const magicRef = useRef<HTMLDivElement>(null);
  const scrollToSection = (sec: "protagonist" | "foundation" | "magic") => {
    const map = { protagonist: protagonistRef, foundation: foundationRef, magic: magicRef };
    map[sec].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowQuickNav(false);
  };

  // ---------- Protagonist state ----------
  const [protagonistName, setProtagonistName] = useState("");
  const [protagonistAge, setProtagonistAge] = useState<number | null>(null);
  const [protagonistGender, setProtagonistGender] = useState("");
  const [protagonistArchetype, setProtagonistArchetype] = useState("");
  const [protagonistTrait, setProtagonistTrait] = useState("");
  const [protagonistBackground, setProtagonistBackground] = useState("");
  const [protagonistDesire, setProtagonistDesire] = useState("");
  const [protagonistFear, setProtagonistFear] = useState("");
  const [protagonistRelationships, setProtagonistRelationships] = useState("");
  const [protagonistPhysicalDescription, setProtagonistPhysicalDescription] = useState("");

  const filledProtagonistFields = [
    protagonistName, protagonistAge, protagonistGender, protagonistArchetype,
    protagonistTrait, protagonistBackground, protagonistDesire, protagonistFear,
    protagonistRelationships, protagonistPhysicalDescription,
  ].filter(Boolean).length;
  const totalProtagonistFields = 10;

  // ---------- Foundation state ----------
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [setting, setSetting] = useState("");
  const [tone, setTone] = useState(40);
  const [selectedPOV, setSelectedPOV] = useState("");
  const [storyLength, setStoryLength] = useState(40);

  // ---------- Magic state ----------
  const [selectedVoice, setSelectedVoice] = useState("");
  const [title, setTitle] = useState("");
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);

  // ---------- User profile ----------
  const [userProfile, setUserProfile] = useState<{ nickname: string; tier: number; age: number } | null>(null);

  // ---------- Auth redirect ----------
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // ---------- Fetch user profile ----------
  useEffect(() => {
    if (!userId || !accessToken) return;
    const fetchProfile = async () => {
      const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${backend}/users/${userId}/profile/data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success" && data.profile) setUserProfile(data.profile);
      }
    };
    fetchProfile();
  }, [userId, accessToken]);

  // ---------- Ripple effect ----------
  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      lastMoveTime.current = Date.now();
      const now = Date.now();
      if (now - lastColorChangeTime.current > 500) {
        colorIndex.current = (colorIndex.current + 1) % GRADIENT_COLORS.length;
        lastColorChangeTime.current = now;
      }
      const pair: [string, string] = [
        GRADIENT_COLORS[colorIndex.current],
        GRADIENT_COLORS[(colorIndex.current + 1) % GRADIENT_COLORS.length],
      ];
      const id = Date.now() + rippleCounter.current++;
      ripples.current = [...ripples.current, { id, x: e.clientX, y: e.clientY, colorPair: pair }];
      setTimeout(() => {
        ripples.current = ripples.current.filter((r) => r.id !== id);
      }, 1000);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ---------- Quick nav on scroll ----------
  useEffect(() => {
    const onScroll = () => setShowQuickNav(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------- Character preview ----------
  useEffect(() => {
    setShowCharacterPreview(filledProtagonistFields > 0);
  }, [filledProtagonistFields]);

  // ---------- Helper: skip protagonist ----------
  const skipProtagonist = () => {
    setProtagonistName("");
    setProtagonistAge(null);
    setProtagonistGender("");
    setProtagonistArchetype("");
    setProtagonistTrait("");
    setProtagonistBackground("");
    setProtagonistDesire("");
    setProtagonistFear("");
    setProtagonistRelationships("");
    setProtagonistPhysicalDescription("");
    foundationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ---------- Title generator ----------
  const generateTitle = async () => {
    setIsLoadingTitle(true);
    try {
      const payload = getInitialStoryData();
      const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${backend}/utility/title_generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ initial_story_data: payload }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setTitle(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTitle(false);
    }
  };

  // ---------- Build initial payload ----------
  const getInitialStoryData = () => ({
    POV: selectedPOV,
    Tone: tone,
    Genre: selectedGenres,
    "Sub-Genre": selectedSubGenres,
    Title: title,
    Length: storyLength,
    Setting: setting,
    user_id: userId,
    story_type: storyType,
    story_id: null,
    "Guide Prose": selectedVoice ? [selectedVoice] : [""],
    "Additional Themes": selectedThemes,
    target_audience_age: userProfile?.age ?? null,
    protagonist_name: protagonistName || null,
    protagonist_age: protagonistAge || null,
    protagonist_gender: protagonistGender || null,
    protagonist_archetype: protagonistArchetype || null,
    protagonist_core_trait: protagonistTrait || null,
    protagonist_background: protagonistBackground || null,
    protagonist_desire: protagonistDesire || null,
    protagonist_fear: protagonistFear || null,
    protagonist_relationships: protagonistRelationships || null,
    protagonist_physical_description: protagonistPhysicalDescription || null,
  });

  // ---------- Begin adventure ----------
  const handleBeginAdventure = async () => {
    if (!userId) return setError("Please log in to start your adventure.");
    setIsLoading(true);
    setShowPhases(true);
    setError(null);

    try {
      const backend = process.env.NEXT_PUBLIC_API_BASE_URL;

      // 1. Initialize story
      const initRes = await fetch(
        `${backend}/stories/initialize_story?user_id=${userId}&story_type=${storyType}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      if (!initRes.ok) throw new Error(`Init failed: ${await initRes.text()}`);
      const { story_id } = await initRes.json();

      // 2. Generate premise
      const payload = { ...getInitialStoryData(), story_id };
      console.log(payload)
      const premiseRes = await fetch(`${backend}/premise`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ initial_story_data: payload, model: "None" }),
      });

      if (!premiseRes.ok) {
        const errorText = await premiseRes.text();
        let errorData;
        try { errorData = JSON.parse(errorText); } catch {}
        if (premiseRes.status === 390) {
          throw new Error(errorData?.detail || "Inappropriate words found in user context");
        } else if (premiseRes.status === 380) {
          throw new Error(errorData?.detail || "User monthly word count limit reached");
        } else {
          throw new Error("Failed to create story");
        }
      }

      // Success → redirect
      router.push(`/generation-app?story_id=${story_id}&story_type=${storyType}`);
    } catch (e: any) {
      setError(e.message ?? "Failed to create story");
      setShowPhases(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Top Loader ----------
  const TopLoader = ({ loading }: { loading: boolean }) => (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 z-[1000] origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#6C5CE7] animate-pulse"
            style={{ backgroundSize: "200% 100%", animation: "gradient-shift 1.5s ease infinite" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
        <TopLoader loading />
        Checking authentication...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <TopLoader loading={authLoading || isLoading} />
      <NavbarRightDashboard />

      <div className="min-h-screen text-[#2D3436] pb-20 py-18 relative px-4 sm:px-6 lg:px-8">
        {/* Ripple background */}
        {mounted && (
          <div className="fixed inset-0 pointer-events-none z-20">
            <AnimatePresence>
              {ripples.current.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0.5, scale: 0.6 }}
                  animate={{ opacity: 0, scale: 2.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute rounded-full"
                  style={{
                    width: 50,
                    height: 50,
                    left: r.x - 25,
                    top: r.y - 25,
                    background: `radial-gradient(circle, ${r.colorPair[0]} 0%, ${r.colorPair[1]} 70%, transparent 100%)`,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Quick nav (mobile) */}
        <AnimatePresence>
          {showQuickNav && (
            <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
              className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg px-4 py-3 md:hidden">
              <div className="flex justify-around items-center max-w-md mx-auto">
                <button onClick={() => scrollToSection("protagonist")} className="flex flex-col items-center text-xs">
                  <User className="w-5 h-5 text-[#6C5CE7] mb-1" />
                  <span className="text-[#2D3436]">Hero</span>
                </button>
                <button onClick={() => scrollToSection("foundation")} className="flex flex-col items-center text-xs">
                  <BookOpen className="w-5 h-5 text-[#FF7675] mb-1" />
                  <span className="text-[#2D3436]">Story</span>
                </button>
                <button onClick={() => scrollToSection("magic")} className="flex flex-col items-center text-xs">
                  <Wand2 className="w-5 h-5 text-[#FFD166] mb-1" />
                  <span className="text-[#2D3436]">Magic</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character preview (desktop) */}
        <AnimatePresence>
          {showCharacterPreview && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="hidden lg:block fixed bottom-8 right-8 bg-white p-6 rounded-2xl shadow-2xl border-4 border-[#E5E5E5] max-w-xs z-30"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg text-[#6C5CE7]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  Your Hero
                </h4>
                <button onClick={() => setShowCharacterPreview(false)} className="text-[#2D3436] opacity-40 hover:opacity-100">
                  ×
                </button>
              </div>
              {protagonistName && <p className="font-bold text-xl mb-2 text-[#2D3436]">{protagonistName}</p>}
              {protagonistAge && <p className="text-sm text-[#2D3436]">Age: {protagonistAge}</p>}
              {protagonistGender && <p className="text-sm text-[#2D3436]">Gender: {protagonistGender}</p>}
              {protagonistTrait && <p className="text-sm text-[#2D3436] italic">&quot;{protagonistTrait}&quot;</p>}
              {protagonistArchetype && <p className="text-xs text-[#6C5CE7] mt-2">• {protagonistArchetype}</p>}
              <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                <p className="text-xs text-[#2D3436] opacity-60">
                  {filledProtagonistFields}/{totalProtagonistFields} details filled
                </p>
                <div className="w-full bg-[#E5E5E5] h-2 rounded-full mt-2">
                  <div
                    className="bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] h-2 rounded-full transition-all"
                    style={{ width: `${(filledProtagonistFields / totalProtagonistFields) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase Modal — Beautiful & Reusable */}
        <StoryCreationPhases isVisible={showPhases} />

        {/* Error toast */}
        {error && (
          <motion.div
            className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs sm:max-w-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error}
            <button className="ml-4 text-white underline" onClick={() => setError(null)}>
              Close
            </button>
          </motion.div>
        )}

        {/* Story-type popup */}
        <AnimatePresence>
          {showStoryTypePopup && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStoryTypePopup(false)}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  Choose Your Journey
                </h2>
                <div className="space-y-4">
                  {(["interactive", "classic"] as const).map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => {
                        setStoryType(type);
                        setShowStoryTypePopup(false);
                      }}
                      className={`w-full p-4 sm:p-6 rounded-2xl border-4 text-left transition-all ${storyType === type
                          ? "border-[#6C5CE7] bg-gradient-to-r from-[#6C5CE7]/10 to-[#00BFA6]/10"
                          : "border-[#E5E5E5] hover:border-[#6C5CE7]"
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#2D3436]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                        {type === "interactive" ? "Interactive Adventure" : "Classic Narrative"}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#2D3436]" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {type === "interactive"
                          ? "Shape the story with your choices and decisions"
                          : "Experience a traditional, flowing story"}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div className="text-center mt-12 sm:mt-16 md:mt-24 px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] bg-clip-text text-transparent mb-4"
            style={{ fontFamily: "Fredoka, sans-serif" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Weave Your Tale
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-[#2D3436] opacity-70 italic"
            style={{ fontFamily: "Annie Use Your Telescope, cursive" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Every great story begins with a single spark of imagination...
          </motion.p>
        </motion.div>

        {/* Story-type selector */}
        <motion.div className="flex justify-center mt-6 sm:mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] rounded-full blur-md opacity-50"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.button
              onClick={() => setShowStoryTypePopup(true)}
              className="relative border-4 border-[#6C5CE7] rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-[#2D3436] bg-white backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-[#00BFA6] shadow-2xl transition-all hover:shadow-[0_0_30px_rgba(108,92,231,0.5)]"
              style={{ fontFamily: "Fredoka, sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {storyType === "interactive" ? "Interactive Adventure" : "Classic Narrative"}
            </motion.button>
            <p className="text-xs text-[#2D3436] mt-2 opacity-60 italic text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
              All fields are optional – fill what inspires you!
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <ProtagonistSection
          ref={protagonistRef}
          expanded={expandedSections.protagonist}
          toggleExpanded={() => toggleSection("protagonist")}
          skipProtagonist={skipProtagonist}
          scrollToNext={() => foundationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          protagonistName={protagonistName}
          setProtagonistName={setProtagonistName}
          protagonistAge={protagonistAge}
          setProtagonistAge={setProtagonistAge}
          protagonistGender={protagonistGender}
          setProtagonistGender={setProtagonistGender}
          protagonistArchetype={protagonistArchetype}
          setProtagonistArchetype={setProtagonistArchetype}
          protagonistTrait={protagonistTrait}
          setProtagonistTrait={setProtagonistTrait}
          protagonistBackground={protagonistBackground}
          setProtagonistBackground={setProtagonistBackground}
          protagonistDesire={protagonistDesire}
          setProtagonistDesire={setProtagonistDesire}
          protagonistFear={protagonistFear}
          setProtagonistFear={setProtagonistFear}
          protagonistRelationships={protagonistRelationships}
          setProtagonistRelationships={setProtagonistRelationships}
          protagonistPhysicalDescription={protagonistPhysicalDescription}
          setProtagonistPhysicalDescription={setProtagonistPhysicalDescription}
          filledCount={filledProtagonistFields}
          totalFields={totalProtagonistFields}
        />

        <FoundationSection
          ref={foundationRef}
          expanded={expandedSections.foundation}
          toggleExpanded={() => toggleSection("foundation")}
          scrollToNext={() => magicRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedSubGenres={selectedSubGenres}
          setSelectedSubGenres={setSelectedSubGenres}
          selectedThemes={selectedThemes}
          setSelectedThemes={setSelectedThemes}
          setting={setting}
          setSetting={setSetting}
          tone={tone}
          setTone={setTone}
          selectedPOV={selectedPOV}
          setSelectedPOV={setSelectedPOV}
          storyLength={storyLength}
          setStoryLength={setStoryLength}
          userAge={userProfile?.age ?? null}
        />

        <MagicSection
          ref={magicRef}
          expanded={expandedSections.magic}
          toggleExpanded={() => toggleSection("magic")}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          title={title}
          setTitle={setTitle}
          isLoadingTitle={isLoadingTitle}
          generateTitle={generateTitle}
        />

        {/* Begin adventure button */}
        <motion.div className="text-center mt-12 sm:mt-16 px-4 mb-16 sm:mb-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <motion.button
            onClick={handleBeginAdventure}
            className="px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#00BFA6] text-white text-lg sm:text-2xl font-bold rounded-full shadow-2xl border-4 border-white"
            style={{ fontFamily: "Fredoka, sans-serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Adventure
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}