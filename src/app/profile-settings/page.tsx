"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import NavbarRightDashboard from "../components/NavbarRightDashboard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

interface UserProfile {
  user_id: string;
  nickname: string;
  age: number | null;
  tier: string;
  no_genre: string[];
  no_themes: string[];
}

export default function ProfileSettings() {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [tier, setTier] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, accessToken } = useAuth();

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

  const availableTiers = ["1", "2", "3", "4"];

  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!userId || !accessToken) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://whimsera.com";
        const response = await fetch(`${backendUrl}/users/${userId}/profile/data`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch profile data: ${errorData.detail || response.statusText}`);
        }

        const { status, profile }: { status: string; profile: UserProfile } = await response.json();
        
        if (status === "success" && profile) {
          setNickname(profile.nickname || "");
          setAge(profile.age ? profile.age.toString() : "");
          setTier(profile.tier || "");
          setSelectedGenres(
            genres.filter((genre) => !profile.no_genre?.includes(genre))
          );
          setSelectedThemes(
            themes.filter((theme) => !profile.no_themes?.includes(theme))
          );
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Error loading profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, [userId, accessToken]);

  const handleSaveSettings = async () => {
    try {
      if (!availableTiers.includes(tier)) {
        setError("Please select a valid tier");
        return;
      }

      const noGenres = genres.filter((genre) => !selectedGenres.includes(genre));
      const noThemes = themes.filter((theme) => !selectedThemes.includes(theme));

      const userData = {
        nickname,
        age: parseInt(age) || 0,
        tier,
        no_genre: noGenres,
        no_themes: noThemes,
      };

      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://whimsera.com";
      const response = await fetch(`${backendUrl}/users/${userId}/profile/setting`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update settings: ${errorData.detail || response.statusText}`);
      }

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Error saving settings. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00BFA6] shadow-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <p className="mt-4 text-[#2D3436] font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
            Loading your profile...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarRightDashboard />

      {error && (
        <motion.div
          className="fixed top-24 right-4 bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-white p-6 rounded-2xl shadow-2xl z-50 max-w-full sm:max-w-md border-4 border-white"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-lg mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>Oops!</p>
              <p className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>
            </div>
            <button
              className="ml-4 text-white hover:text-[#2D3436] transition-colors"
              onClick={() => setError(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto mt-32 px-4 sm:px-6 pb-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#74C0FC] bg-clip-text text-transparent mb-3"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            Profile Settings
          </h1>
          <p className="text-[#2D3436] opacity-70 text-base sm:text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
            Customize your storytelling experience
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00BFA6]/20 rounded-3xl blur-xl" />
          
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#E5E5E5]">
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-[#2D3436] font-semibold mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-2 border-[#E5E5E5] text-[#2D3436] bg-white/80 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all shadow-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    placeholder="Enter your nickname"
                  />
                </div>

                <div>
                  <label className="block text-[#2D3436] font-semibold mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-2 border-[#E5E5E5] text-[#2D3436] bg-white/80 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all shadow-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-[#2D3436] font-semibold mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Subscription Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl border-2 border-[#E5E5E5] text-[#2D3436] bg-white/80 focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all shadow-sm cursor-pointer"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <option value="" disabled>Select your tier</option>
                  {availableTiers.map((tierOption) => (
                    <option key={tierOption} value={tierOption}>
                      Tier {tierOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div className="py-4">
                <div className="flex justify-center">
                  <span className="bg-white px-4 text-sm text-[#2D3436] opacity-60 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Content Preferences
                  </span>
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="block text-[#2D3436] font-semibold mb-4 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Allowed Genres
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {genres.map((genre) => (
                    <motion.label
                      key={genre}
                      className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedGenres.includes(genre)
                          ? "border-[#6C5CE7] bg-gradient-to-r from-[#6C5CE7]/10 to-[#00BFA6]/10 shadow-md"
                          : "border-[#E5E5E5] bg-white/50 hover:border-[#6C5CE7]/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() =>
                          setSelectedGenres((prev) =>
                            prev.includes(genre)
                              ? prev.filter((g) => g !== genre)
                              : [...prev, genre]
                          )
                        }
                        className="h-5 w-5 text-[#6C5CE7] focus:ring-[#6C5CE7] border-[#E5E5E5] rounded"
                      />
                      <span className="text-[#2D3436] font-medium text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {genre}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div>
                <label className="block text-[#2D3436] font-semibold mb-4 text-sm uppercase tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Allowed Themes
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <motion.label
                      key={theme}
                      className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedThemes.includes(theme)
                          ? "border-[#00BFA6] bg-gradient-to-r from-[#00BFA6]/10 to-[#74C0FC]/10 shadow-md"
                          : "border-[#E5E5E5] bg-white/50 hover:border-[#00BFA6]/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme)}
                        onChange={() =>
                          setSelectedThemes((prev) =>
                            prev.includes(theme)
                              ? prev.filter((t) => t !== theme)
                              : [...prev, theme]
                          )
                        }
                        className="h-5 w-5 text-[#00BFA6] focus:ring-[#00BFA6] border-[#E5E5E5] rounded"
                      />
                      <span className="text-[#2D3436] font-medium text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {theme}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                onClick={handleSaveSettings}
                className="w-full py-3 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#74C0FC] text-white shadow-2xl border-4 border-white relative overflow-hidden"
                style={{ fontFamily: "Fredoka, sans-serif" }}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(108, 92, 231, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative">Save Settings</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}