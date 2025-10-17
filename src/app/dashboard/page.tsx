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
}

interface UserProfile {
  nickname: string;
  stories: Story[];
}

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
        await fetchProfile(); // Refresh user profile to update UI
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarRightDashboard />

      {error && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-2xl z-50 max-w-md animate-slide-in">
          {error}
          <button
            className="ml-4 text-white underline font-medium"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-[72px] text-left text-[#6C5CE7] mt-36 ml-16"
        style={{ fontFamily: "var(--font-annie)" }}
      >
        Welcome {userProfile?.nickname || "User"}!
      </motion.h1>

      <div className="flex-1 max-w-6xl mx-auto px-8 py-16">
        {loading ? (
          <p className="text-xl text-center text-gray-600">Loading...</p>
        ) : userProfile?.stories.length ? (
          <div className="relative">
            <div className="flex space-x-6 overflow-hidden">
              {getCurrentSlideStories().map((story) => (
                <motion.div
                  key={story.story_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 flex flex-col justify-between min-w-[300px] border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {story.title || "Untitled Story"}
                    </h3>
                    <button
                      onClick={() => handleDeleteStory(story.title, story.story_type)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Delete Story"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex justify-between">
                      <span className="font-medium">Word Count:</span>
                      <span>{story.word_count.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{story.story_type}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Latest Chapter:</span>
                      <span>{story.latest_chapter_id}</span>
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
                    className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-[#00BFA6] to-[#00997f] text-white font-medium hover:shadow-md transition-all"
                  >
                    Continue Story
                  </button>
                </motion.div>
              ))}
            </div>

            {userProfile.stories.length > 3 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevSlide}
                  className="px-6 py-2 bg-gradient-to-r from-[#00BFA6] to-[#00997f] text-white rounded-lg font-medium hover:shadow-md transition-all"
                >
                  Prev
                </button>
                <button
                  onClick={nextSlide}
                  className="px-6 py-2 bg-gradient-to-r from-[#00BFA6] to-[#00997f] text-white rounded-lg font-medium hover:shadow-md transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            No stories yet. Start creating!
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}