"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Trash2 } from "lucide-react";
import Footer from "../components/Footer";
import NavbarRightDashboard from "../components/NavbarRightDashboard";

interface Story {
  title: string;
  story_id: string;
  story_type: string;
  word_count: number;
  latest_chapter_id: number;
  continue_scene_id: number;
  blurb: string;
  model: string;
  image_data: string | null;
  public: boolean;
  complete: boolean;
}

interface UserProfile {
  nickname: string;
  tier: number;
  stories: Story[];
}

// Model mapping for display names
const TIER_1_MODELS: { [key: string]: string } = {
  "gpt-5-nano-2025-08-07": "Flicker",
  "gemini-2.5-flash-lite": "Kite",
  "openai/gpt-oss-120b": "Lyric",
  "llama-3.3-70b-versatile": "Lyra"
};

const TIER_2_MODELS: { [key: string]: string } = {
  "gpt-5-mini-2025-08-07": "Ember",
  "gpt-4o-mini-2024-07-18": "Echo",
  "gemini-2.5-flash": "Nova",
  "claude-haiku-4-5-20251001": "Haiku"
};

const TIER_3_MODELS: { [key: string]: string } = {
  "claude-sonnet-4-5-20250929": "Sonnet",
  "gpt-5-2025-08-07": "Aurora",
  "gpt-4o-2024-08-06": "Vesper",
  "gemini-2.5-pro": "Solstice",
  "gpt-4.1-2025-04-14": "Scribe"
};

const TIER_4_MODELS: { [key: string]: string } = {
  "claude-opus-4-1-20250805": "Opus",
  "gpt-5-pro-2025-10-06": "Eclipse",
  "gemini-2.5-pro": "Solara"
};

// Function to get model display name
const getModelDisplayName = (model: string): string => {
  return (
    TIER_1_MODELS[model] || 
    TIER_2_MODELS[model] || 
    TIER_3_MODELS[model] || 
    TIER_4_MODELS[model] || 
    model
  );
};

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, userId, isLoading, accessToken } = useAuth();
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/user-profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setUserProfile({
          nickname: data.profile.nickname,
          tier: data.profile.tier,
          stories: data.stories || [],
        });
      } else {
        setError(data.detail || "Failed to fetch profile");
      }
    } catch (err) {
      setError("An error occurred while fetching the profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userId || !accessToken) return;
    fetchProfile();
  }, [isAuthenticated, userId, accessToken]);

  const handleDeleteStory = async (storyTitle: string, storyType: string) => {
    if (!userId || !storyType) {
      setError("Missing user ID or story type");
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${backendUrl}/users/${userId}/stories/${encodeURIComponent(storyTitle || "")}?story_type=${encodeURIComponent(storyType)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        await fetchProfile();
      } else {
        setError(data.message || "Failed to delete story");
      }
    } catch (err) {
      setError("An error occurred while deleting the story");
      console.error(err);
    }
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
        return 'bg-gradient-to-r from-[#74C0FC] to-[#6C5CE7] text-[#FFF8F1]';
      case 2:
        return 'bg-gradient-to-r from-[#00BFA6] to-[#00997f] text-[#FFF8F1]';
      case 3:
        return 'bg-gradient-to-r from-[#FFD166] to-[#FF7675] text-[#2D3436]';
      case 4:
        return 'bg-gradient-to-r from-[#FF7675] to-[#6C5CE7] text-[#FFF8F1]';
      default:
        return 'bg-gradient-to-r from-[#E5E5E5] to-[#2D3436] text-[#FFF8F1]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
        Checking authentication...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col text-[#2D3436]">
      <NavbarRightDashboard />

      {error && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-[#FF7675] to-[#FFD166] text-[#2D3436] p-4 rounded-xl shadow-2xl z-50 max-w-md animate-slide-in">
          {error}
          <button
            className="ml-4 text-[#2D3436] underline font-medium"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      )}

      {userProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="ml-16 mt-32 flex items-center space-x-3"
        >
          <div className={`px-4 py-2 rounded-full ${getTierBadgeClass(userProfile.tier)} font-medium text-sm shadow-lg`}>
            Tier {userProfile.tier}
          </div>
          <span className="text-[#2D3436] text-lg">Current tier</span>
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-5xl font-bold text-[72px] text-left text-[#6C5CE7] ml-16"
        style={{ fontFamily: "var(--font-annie)" }}
      >
        Welcome {userProfile?.nickname || "User"}!
      </motion.h1>

      <div className="flex-1 max-w-6xl mx-auto px-8 py-16">
        {loading ? (
          <p className="text-xl text-center text-[#2D3436]">Loading...</p>
        ) : userProfile?.stories.length ? (
          <div className="relative">
            <div className="flex space-x-6 overflow-hidden">
              {getCurrentSlideStories().map((story) => {
                const modelDisplayName = getModelDisplayName(story.model);
                return (
                  <motion.div
                    key={story.story_id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-[#FFF8F1] to-[#E5E5E5] rounded-xl shadow-lg p-6 flex flex-col justify-between min-w-[350px] border border-[#E5E5E5] hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {story.image_data && (
                      <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={`data:image/png;base64,${story.image_data}`}
                          alt={story.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-[#2D3436] mb-3 flex-1 pr-2 line-clamp-2">
                        {story.title || "Untitled Story"}
                      </h3>
                      <button
                        onClick={() => handleDeleteStory(story.title, story.story_type)}
                        className="p-2 rounded-full bg-[#FF7675] text-[#FFF8F1] hover:bg-[#FFD166] transition-colors"
                        title="Delete Story"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="text-[#2D3436] text-sm leading-relaxed line-clamp-3">
                        {story.blurb || "No description available."}
                      </p>
                    </div>

                    <div className="space-y-2 text-[#2D3436] mb-4">
                      <p className="flex justify-between">
                        <span className="font-medium">Author:</span>
                        <span className="text-[#2D3436] font-medium">{modelDisplayName}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Word Count:</span>
                        <span className="text-[#2D3436]">{story.word_count.toLocaleString()}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Type:</span>
                        <span className="text-[#2D3436] capitalize">{story.story_type}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Latest Chapter:</span>
                        <span className="text-[#2D3436]">#{story.latest_chapter_id}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={`text-[#2D3436] ${story.complete ? 'text-[#00BFA6]' : 'text-[#FF7675]'}`}>
                          {story.complete ? 'Complete' : 'Incomplete'}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium">Visibility:</span>
                        <span className={`text-[#2D3436] ${story.public ? 'text-[#74C0FC]' : 'text-[#6C5CE7]'}`}>
                          {story.public ? 'Public' : 'Private'}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        if (!userId || !story.story_id || !story.story_type) {
                          alert("Missing required fields: user ID, story ID, or story type.");
                          return;
                        }

                        try {
                          const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                          const response = await fetch(`${backendUrl}/stories/${story.story_id}`, {
                            method: "PUT",
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              user_id: userId,
                              story_type: story.story_type,
                            }),
                          });

                          if (!response.ok) {
                            const errorData = await response.json();
                            console.error("Continue story failed:", errorData);
                            const missingFields = errorData.detail
                              ?.map((err: { loc: (string | number)[]; msg: string; type: string }) =>
                                err.loc.join(".")
                              )
                              .join(", ");
                            alert(`Error: ${errorData.message || `Missing fields: ${missingFields}`}`);
                            return;
                          }

                          router.push(`/generation-app?story_id=${story.story_id}&story_type=${story.story_type}`);
                        } catch (err) {
                          console.error("Error continuing story:", err);
                          alert("Something went wrong while continuing your story.");
                        }
                      }}
                      className="mt-auto px-4 py-2 rounded-md bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] font-medium hover:shadow-md transition-all"
                    >
                      Continue Story
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {userProfile.stories.length > 3 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevSlide}
                  className="px-6 py-2 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] rounded-lg font-medium hover:shadow-md transition-all"
                >
                  Prev
                </button>
                <button
                  onClick={nextSlide}
                  className="px-6 py-2 bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] rounded-lg font-medium hover:shadow-md transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-[#2D3436] mt-8">
            No stories yet. Start creating!
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}