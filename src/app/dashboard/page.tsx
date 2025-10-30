"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Trash2, Globe, Lock, CheckCircle, Circle } from "lucide-react";
import Footer from "../components/Footer";
import NavbarRightDashboard from "../components/NavbarRightDashboard";

interface Story {
  title: string;
  story_id: string;
  story_type: string;
  story_word_count: number;
  latest_chapter_id: number;
  continue_scene_id: number;
  blurb: string;
  model: string;
  image_data: string | null;
  public: boolean;
  complete: boolean;
  story_progress: number;
}

interface UserProfile {
  nickname: string;
  tier: number;
  stories: Story[];
  monthly_word_count: number;
}

// Model mapping
// const TIER_1_MODELS: { [key: string]: string } = {
//   "gpt-5-nano-2025-08-07": "Flicker",
//   "gemini-2.5-flash-lite": "Kite",
//   "openai/gpt-oss-120b": "Lyric",
//   "llama-3.3-70b-versatile": "Lyra",
// };
// const TIER_2_MODELS: { [key: string]: string } = {
//   "gpt-5-mini-2025-08-07": "Ember",
//   "gpt-4o-mini-2024-07-18": "Echo",
//   "gemini-2.5-flash": "Nova",
//   "claude-haiku-4-5-20251001": "Haiku",
// };
// const TIER_3_MODELS: { [key: string]: string } = {
//   "claude-sonnet-4-5-20250929": "Sonnet",
//   "gpt-5-2025-08-07": "Aurora",
//   "gpt-4o-2024-08-06": "Vesper",
//   "gemini-2.5-pro": "Solstice",
//   "gpt-4.1-2025-04-14": "Scribe",
// };
// const TIER_4_MODELS: { [key: string]: string } = {
//   "claude-opus-4-1-20250805": "Opus",
//   "gpt-5-pro-2025-10-06": "Eclipse",
//   "gemini-2.5-pro": "Solara",
// };

const MAX_WORDS_PER_TIER: { [key: number]: number } = {
  1: 100000,
  2: 200000
};

// const getModelDisplayName = (model: string): string => {
//   return (
//     TIER_1_MODELS[model] ||
//     TIER_2_MODELS[model] ||
//     TIER_3_MODELS[model] ||
//     TIER_4_MODELS[model] ||
//     model
//   );
// };

// Loader Component
const TopLoader = ({ isLoading }: { isLoading: boolean }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[1000] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#6C5CE7] animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 1.5s ease infinite'
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // For API calls
  const [error, setError] = useState<string | null>(null);
  const [showPublicConfirm, setShowPublicConfirm] = useState<{ story: Story } | null>(null);
  const router = useRouter();
  const { isAuthenticated, userId, isLoading: authLoading, accessToken } = useAuth();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedBlurb, setSelectedBlurb] = useState<Story | null>(null);

  // Show loader during any processing
  const showLoader = loading || isProcessing || authLoading;

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const fetchProfile = async () => {
    setIsProcessing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${backendUrl}/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setUserProfile({
          nickname: data.profile.nickname,
          tier: data.profile.tier,
          monthly_word_count: data.profile.monthly_word_count || 0,
          stories: data.stories || [],
        });
      } else setError(data.detail || "Failed to fetch profile");
    } catch (err) {
      setError("Error fetching profile");
      console.error(err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };
  const hasReachedWordLimit = (tier: number, wordCount: number): boolean => {
    const maxWords = MAX_WORDS_PER_TIER[tier] || 100000;
    return wordCount >= maxWords;
  };
  const getWordUsageDisplay = (tier: number, wordCount: number): string => {
    const maxWords = MAX_WORDS_PER_TIER[tier] || 100000;
    return `${wordCount.toLocaleString()}/${maxWords.toLocaleString()}`;
  };
  useEffect(() => {
    if (!isAuthenticated || !userId || !accessToken) return;
    fetchProfile();
  }, [isAuthenticated, userId, accessToken]);

  const handleDeleteStory = async (storyTitle: string, storyType: string, storyId: string) => {
    setIsProcessing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${backendUrl}/users/${userId}/stories/${encodeURIComponent(storyId)}/delete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            story_title: storyTitle,
            story_type: storyType,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        await fetchProfile();               // refresh the list
      } else {
        setError(data.message || "Failed to delete story");
      }
    } catch (err) {
      setError("Error deleting story");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueStory = async (storyId: string, storyType: string) => {
    setIsProcessing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${backendUrl}/stories/${storyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          story_type: storyType,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        // Navigate to the generation app with story_id and story_type
        router.push(`/generation-app?story_id=${storyId}&story_type=${storyType}`);
      } else {
        setError(data.message || "Failed to continue story");
      }
    } catch (err) {
      setError("Error continuing story");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMakePublic = async () => {
    if (!showPublicConfirm?.story || !userId || !accessToken) return;

    setIsProcessing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${backendUrl}/stories/progress/${userId}/${showPublicConfirm.story.story_id}/public`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public: true }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        await fetchProfile();
        setShowPublicConfirm(null);
      } else {
        setError(data.message || "Failed to make story public");
      }
    } catch (err) {
      setError("Error making story public");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const canMakePublic = (story: Story) => {
    if (story.story_type === "interactive") return true;
    return story.story_type === "classic" && story.complete;
  };

  const nextSlide = () => {
    if (!userProfile) return;
    setCarouselIndex(
      (prev) => (prev + 1) % Math.ceil(userProfile.stories.length / 3)
    );
  };

  const prevSlide = () => {
    if (!userProfile) return;
    setCarouselIndex((prev) =>
      prev === 0 ? Math.ceil(userProfile.stories.length / 3) - 1 : prev - 1
    );
  };

  const getCurrentSlideStories = () => {
    if (!userProfile) return [];
    const start = carouselIndex * 3;
    return userProfile.stories.slice(start, start + 3);
  };

  const getTierBadgeClass = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-gradient-to-r from-[#74C0FC] to-[#6C5CE7] text-[#FFF8F1]";
      case 2:
        return "bg-gradient-to-r from-[#00BFA6] to-[#00997f] text-[#FFF8F1]";
      case 3:
        return "bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436]";
      case 4:
        return "bg-gradient-to-r from-[#FF7675] to-[#6C5CE7] text-[#FFF8F1]";
      default:
        return "bg-gradient-to-r from-[#E5E5E5] to-[#2D3436] text-[#FFF8F1]";
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
        <TopLoader isLoading={true} />
        Checking authentication...
      </div>
    );

  return (
    <main className="min-h-screen flex flex-col text-[#2D3436]">
      {/* Top Loader - Always present but controlled by showLoader */}
      <TopLoader isLoading={showLoader} />

      <NavbarRightDashboard />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-[#2D3436] p-4 rounded-xl shadow-2xl z-50"
        >
          {error}
          <button
            className="ml-4 text-[#2D3436] underline font-medium"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </motion.div>
      )}

      {userProfile && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="ml-16 mt-32 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`px-4 py-2 rounded-full ${getTierBadgeClass(
                  userProfile.tier
                )} font-medium text-sm shadow-lg`}
              >
                Tier {userProfile.tier}
              </div>
              <span className="text-[#2D3436] text-lg">Current tier</span>
            </div>

            {/* Add Word Usage Display */}
            <div className="flex flex-col items-end">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${hasReachedWordLimit(userProfile.tier, userProfile.monthly_word_count)
                ? 'bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-[#2D3436]'
                : 'bg-white/60 border border-white/30 text-[#2D3436]'
                }`}>
                {getWordUsageDisplay(userProfile.tier, userProfile.monthly_word_count)}
              </div>
              <span className="text-xs text-[#2D3436] mt-1">Monthly Word Usage</span>
            </div>
          </motion.div>

          {/* Upgrade Prompt - Only show if not tier 4 and limit reached */}
          {userProfile &&
            userProfile.tier < 4 &&
            hasReachedWordLimit(userProfile.tier, userProfile.monthly_word_count) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-16 mt-2 mb-4 p-3 bg-gradient-to-r from-[#FFD166] to-[#FF7675] rounded-xl text-[#2D3436] max-w-2xl shadow-lg border-l-4 border-[#FF7675]"
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-[#FF7675]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Monthly word limit reached!</p>
                    <p className="text-sm mt-1">
                      Upgrade to a higher tier to unlock more words per month and continue creating.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold text-[72px] text-left text-[#6C5CE7] ml-16"
            style={{ fontFamily: "var(--font-annie)" }}
          >
            Welcome {userProfile.nickname || "User"}!
          </motion.h1>
        </>
      )}

      <div className="flex-1 max-w-6xl mx-auto px-8 py-16">
        {loading ? (
          <p className="text-xl text-center text-[#2D3436]">Loading...</p>
        ) : userProfile?.stories.length ? (
          <div className="relative">
            <div className="flex space-x-4 overflow-hidden">
              {getCurrentSlideStories().map((story) => {
                const blurb = story.blurb || "No description available.";
                const isBlurbLong = blurb.length > 120;
                const truncated = isBlurbLong
                  ? blurb.slice(0, 120) + "..."
                  : blurb;

                return (
                  <motion.div
                    key={story.story_id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-[#FFF8F1] to-[#E5E5E5] rounded-xl shadow-lg p-5 flex flex-col min-w-[320px] max-w-[320px] h-[560px] border border-[#E5E5E5] overflow-hidden"
                  >
                    {/* Image */}
                    {story.image_data && (
                      <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={`data:image/png;base64,${story.image_data}`}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Title & Delete */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-[#2D3436] line-clamp-2 flex-1 pr-2">
                        {story.title || "Untitled Story"}
                      </h3>
                      <button
                        onClick={() =>
                          handleDeleteStory(story.title, story.story_type, story.story_id)
                        }
                        className="p-1.5 rounded-full bg-[#FF7675] text-[#FFF8F1] hover:bg-[#FFD166] transition-colors flex-shrink-0"
                        title="Delete story"
                        disabled={isProcessing}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Blurb */}
                    <div className="flex-1 mb-3">
                      <p className="text-sm text-[#2D3436] line-clamp-3">
                        {truncated}
                      </p>
                      {isBlurbLong && (
                        <button
                          onClick={() => setSelectedBlurb(story)}
                          className="text-[#6C5CE7] font-medium hover:underline mt-1 text-xs"
                          disabled={isProcessing}
                        >
                          Read More
                        </button>
                      )}
                    </div>

                    {/* Status Badges - Compact Row */}
                    <div className="flex flex-wrap gap-2 mb-3 -space-x-1">
                      {/* Public Status */}
                      <div className="flex items-center space-x-1 bg-white/50 px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                        {story.public ? (
                          <>
                            <Globe size={12} className="text-[#00BFA6]" />
                            <span className="text-[#00BFA6]">Public</span>
                          </>
                        ) : (
                          <>
                            <Lock size={12} className="text-[#FF7675]" />
                            <span className="text-[#FF7675]">Private</span>
                          </>
                        )}
                        {!story.public && canMakePublic(story) && (
                          <button
                            onClick={() => setShowPublicConfirm({ story })}
                            className="ml-1 p-0.5 rounded-full bg-[#6C5CE7]/20 hover:bg-[#6C5CE7]/40 transition-colors"
                            title="Make public"
                            disabled={isProcessing}
                          >
                            <Globe size={10} className="text-[#6C5CE7]" />
                          </button>
                        )}
                      </div>

                      {/* Completion Status */}
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border border-white/30 ${story.complete
                        ? 'bg-green-50/50 text-[#00BFA6] border-green-200/50'
                        : 'bg-red-50/50 text-[#FF7675] border-red-200/50'
                        }`}>
                        {story.complete ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Circle size={12} className="fill-transparent" />
                        )}
                        <span>{story.complete ? 'Complete' : 'Incomplete'}</span>
                      </div>
                    </div>

                    {/* Other Metadata - Compact */}
                    <div className="space-y-1 text-xs text-[#2D3436] mb-4">
                      {!story.complete && (
                        <p className="flex items-center justify-between">
                          <span className="font-medium">Completion:</span>
                          <span className="flex items-center gap-0.5">
                            <span>{story.story_progress.toLocaleString()}</span>
                            <span className="font-medium">%</span>
                          </span>
                        </p>
                      )}
                      <p className="flex items-center justify-between">
                        <span className="font-medium">Words:</span>
                        <span>{story.story_word_count.toLocaleString()}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="font-medium">Type:</span>
                        <span className="capitalize">{story.story_type}</span>
                      </p>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={() => handleContinueStory(story.story_id, story.story_type)}
                      disabled={isProcessing}
                      className="mt-auto w-full px-3 py-2 rounded-md bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] font-medium text-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? "Loading..." : "Continue Story"}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {userProfile.stories.length > 3 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevSlide}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] rounded-lg font-medium text-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  ← Prev
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] rounded-lg font-medium text-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-[#2D3436] mb-4">No stories yet.</p>
            <p className="text-sm text-gray-600">Start creating your first masterpiece!</p>
          </motion.div>
        )}
      </div>

      {/* Blurb Popup */}
      <AnimatePresence>
        {selectedBlurb && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlurb(null)}
          >
            <motion.div
              className="bg-[#FFF8F1] rounded-2xl p-6 max-w-md w-full shadow-xl relative max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-[#2D3436]">
                {selectedBlurb.title}
              </h3>
              <p className="text-[#2D3436] text-sm leading-relaxed">
                {selectedBlurb.blurb}
              </p>
              <button
                onClick={() => setSelectedBlurb(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-[#2D3436] text-lg"
                disabled={isProcessing}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Make Public Confirmation Popup */}
      <AnimatePresence>
        {showPublicConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPublicConfirm(null)}
          >
            <motion.div
              className="bg-[#FFF8F1] rounded-2xl p-6 max-w-md w-full shadow-xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-3 text-[#2D3436]">
                Make &quot;{showPublicConfirm.story.title}&quot; Public?
              </h3>
              <p className="text-[#2D3436] text-sm leading-relaxed mb-6">
                This story will be visible to everyone in the final release.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublicConfirm(null)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakePublic}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Make Public"}
                </button>
              </div>
              <button
                onClick={() => setShowPublicConfirm(null)}
                disabled={isProcessing}
                className="absolute top-3 right-3 text-gray-600 hover:text-[#2D3436] text-lg"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Add CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  );
}