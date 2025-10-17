"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
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

  useEffect(() => {
    if (!isAuthenticated || !userId || !accessToken) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 👈 Add token
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

    fetchProfile();
  }, [isAuthenticated, userId, accessToken]);
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
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarRightDashboard />

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
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : userProfile?.stories.length ? (


          <div className="relative">
            <div className="flex space-x-6 overflow-hidden">
              {getCurrentSlideStories().map((story) => (
                <div
                  key={story.story_id}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
                >
                  <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  <p>Word Count: {story.word_count}</p>
                  <p>Type: {story.story_type}</p>
                  <p>Latest Chapter: {story.latest_chapter_id}</p>
                  <button
                    onClick={async () => {
                      if (!userId || !story.story_id || !story.story_type) {
                        alert("Missing required fields: user ID, story ID, or story type.");
                        return;
                      }

                      try {
                        console.log("Request body:", {
                          user_id: userId,
                          story_id: story.story_id,
                          story_type: story.story_type,
                        });
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

                        // Navigate to the story generation page with query parameters
                        router.push(`/generation-app?story_id=${story.story_id}&story_type=${story.story_type}`);
                      } catch (err) {
                        console.error("Error continuing story:", err);
                        alert("Something went wrong while continuing your story.");
                      }
                    }}
                    className="mt-4 px-4 py-2 rounded-md bg-[#00BFA6] text-white hover:bg-[#00997f] transition"
                  >
                    Continue Story
                  </button>
                </div>
              ))}
            </div>

            {userProfile.stories.length > 3 && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevSlide}
                  className="px-4 py-2 bg-[#00BFA6] text-white rounded-lg hover:bg-[#00997f] transition"
                >
                  Prev
                </button>
                <button
                  onClick={nextSlide}
                  className="px-4 py-2 bg-[#00BFA6] text-white rounded-lg hover:bg-[#00997f] transition"
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

