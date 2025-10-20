"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const genres = [
  "Fantasy",
  "Mystery",
  "Comedy",
  "Sci-Fi",
  "Romance",
  "Adventure",
  "Scary",
  "Suspense",
  "Slice of Life",
];

const themes = [
  "Friendship & Loyalty",
  "Love & Romance",
  "Mystery & Secrets",
  "Adventure & Exploration",
  "Betrayal & Revenge",
  "Courage & Heroism",
  "Loss & Redemption",
  "Comedy & Humor",
];

const tiers = [
  { value: 1, name: "Explorer", description: "Begin your journey", icon: "🌱" },
  { value: 1, name: "Adventurer", description: "Seek new horizons", icon: "⚔️" },
  { value: 1, name: "Hero", description: "Face greater challenges", icon: "🛡️" },
  { value: 1, name: "Legend", description: "Master your destiny", icon: "👑" },
];

export default function ProfileSetup() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isParent, setIsParent] = useState<boolean | null>(null);
  const [childAge, setChildAge] = useState("");
  const [userAge, setUserAge] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(genres);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(themes);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleNext = () => {
    if (step === 1 && isParent === null) {
      setFormError("Please select an option");
      return;
    }
    if (step === 2 && isParent && !childAge) {
      setFormError("Please enter your child's age");
      return;
    }
    if (step === 2 && !isParent && !userAge) {
      setFormError("Please enter your age");
      return;
    }
    if (step === 2 && !nickname) {
      setFormError("Please enter a nickname");
      return;
    }
    setFormError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setFormError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!selectedTier) {
      setFormError("Please select a tier");
      return;
    }

    if (!nickname) {
      setFormError("Please enter a nickname");
      return;
    }

    const age = isParent ? parseInt(childAge) : parseInt(userAge);
    if (!age) {
      setFormError("Please provide a valid age");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      console.log("Sending request to /api/register-with-tag with accessToken:", accessToken);

      // Call Supabase /api/register-with-tag (without user_tag)
      const resp = await fetch("/api/register-with-tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ nickname, age }),
      });

      const json = await resp.json();
      console.log("Response from /api/register-with-tag:", json);

      if (!resp.ok) {
        if (json.error.includes("Unauthorized")) {
          setFormError("Authentication failed. Please log in again.");
          router.push("/login");
        } else {
          setFormError("Profile setup failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      const newUserId = json.userId || json.id;

      // Calculate no_genre and no_themes (genres/themes NOT selected)
      const no_genre = isParent ? genres.filter((g) => !selectedGenres.includes(g)) : [];
      const no_themes = isParent ? themes.filter((t) => !selectedThemes.includes(t)) : [];

      // Call FastAPI /users
      try {
        const payload = {
          nickname,
          age,
          tier: selectedTier,
          no_genre,
          no_themes,
          stories: [],
          user_id: newUserId,
        };
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        console.log("Sending request to FastAPI /users:", payload);
        const backendResp = await fetch(`${backendUrl}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!backendResp.ok) {
          console.error("FastAPI response:", await backendResp.text());
          setFormError("Profile setup succeeded but backend registration failed.");
          setLoading(false);
          return;
        }

        console.log("FastAPI registration successful");
        router.push("/dashboard");
      } catch (err) {
        console.error("🔥 Backend request failed:", err);
        setFormError("Profile setup succeeded but backend registration failed. Please contact support.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("🔥 Error in profile setup:", error);
      setFormError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/download.jpeg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative z-20 bg-white/10 shadow-2xl w-[90%] max-w-2xl flex flex-col items-center backdrop-blur-lg"
          style={{
            background: "linear-gradient(135deg, rgba(108, 92, 231, 0.9), rgba(0, 191, 166, 0.85))",
            padding: "40px",
            gap: "25px",
            borderRadius: "48px",
          }}
        >
          <Link
            href="/"
            className="text-5xl md:text-6xl leading-none font-bold text-white drop-shadow-lg mb-2"
            style={{ fontFamily: "var(--font-annie)" }}
          >
            Whimsera
          </Link>

          {formError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-200 bg-red-500/30 px-4 py-2 rounded-lg text-sm text-center backdrop-blur-sm"
            >
              {formError}
            </motion.p>
          )}

          {/* Step 1: Parent or User */}
          {step === 1 && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">
                Are you a parent setting up for your child?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsParent(true);
                    setFormError("");
                  }}
                  className={`flex-1 py-6 px-8 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                    isParent === true
                      ? "bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436] shadow-2xl"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  👨‍👩‍👧‍👦 Yes, I&apos;m a parent
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsParent(false);
                    setFormError("");
                  }}
                  className={`flex-1 py-6 px-8 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                    isParent === false
                      ? "bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436] shadow-2xl"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  ✨ No, it&apos;s for me
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full max-w-md bg-gradient-to-r from-[#00BFA6] to-[#74C0FC] text-white py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300"
              >
                Next →
              </motion.button>
            </div>
          )}

          {/* Step 2: Age and Nickname */}
          {step === 2 && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">
                {isParent ? "Tell us about your child" : "Tell us about yourself"}
              </h2>
              <div className="w-full max-w-md space-y-4">
                <div className="flex flex-col text-left">
                  <label className="text-lg mb-2 text-white font-semibold">Nickname</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter a nickname (e.g., Luna)"
                    className="px-4 py-3 rounded-xl border-2 border-white/50 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="flex flex-col text-left">
                  <label className="text-lg mb-2 text-white font-semibold">
                    {isParent ? "Child's Age" : "Your Age"}
                  </label>
                  <input
                    type="number"
                    value={isParent ? childAge : userAge}
                    onChange={(e) => (isParent ? setChildAge(e.target.value) : setUserAge(e.target.value))}
                    placeholder="Enter age"
                    className="px-4 py-3 rounded-xl border-2 border-white/50 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD166] text-lg backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="flex-1 bg-white/20 text-white py-4 rounded-xl text-xl font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  ← Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#74C0FC] text-white py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  {isParent ? "Next →" : "Choose Tier →"}
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 3: Genre Selection (Parents only) */}
          {step === 3 && isParent && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">Select which genres to allow</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                {genres.map((genre) => (
                  <motion.button
                    key={genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleGenre(genre)}
                    className={`py-3 px-4 rounded-xl text-base font-semibold transition-all duration-300 ${
                      selectedGenres.includes(genre)
                        ? "bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436] shadow-lg"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {genre}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="flex-1 bg-white/20 text-white py-4 rounded-xl text-xl font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  ← Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#74C0FC] text-white py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  Next →
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 4: Theme Selection (Parents only) */}
          {step === 4 && isParent && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">Select which themes to allow</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {themes.map((theme) => (
                  <motion.button
                    key={theme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTheme(theme)}
                    className={`py-3 px-4 rounded-xl text-base font-semibold transition-all duration-300 ${
                      selectedThemes.includes(theme)
                        ? "bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436] shadow-lg"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {theme}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="flex-1 bg-white/20 text-white py-4 rounded-xl text-xl font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  ← Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-[#00BFA6] to-[#74C0FC] text-white py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  Next →
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 5 (or 3 for non-parents): Tier Selection */}
          {((step === 5 && isParent) || (step === 3 && !isParent)) && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h2 className="text-3xl font-bold text-white text-center">Choose your adventure tier</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {tiers.map((tier) => (
                  <motion.button
                    key={tier.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedTier(tier.value);
                      setFormError("");
                    }}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                      selectedTier === tier.value
                        ? "bg-gradient-to-br from-[#FFD166] to-[#FF7675] text-[#2D3436] shadow-2xl"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <div className="text-4xl mb-2">{tier.icon}</div>
                    <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                    <p className={`text-sm ${selectedTier === tier.value ? "text-[#2D3436]/80" : "text-white/80"}`}>
                      {tier.description}
                    </p>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="flex-1 bg-white/20 text-white py-4 rounded-xl text-xl font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  ← Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || !selectedTier}
                  className="flex-1 bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436] py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Magic..." : "Complete Setup ✨"}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}