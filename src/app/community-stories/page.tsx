"use client";
import React, { useState, useEffect } from 'react';
import { Star, Eye, Calendar, BookOpen, X } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import NavbarRightDashboard from "../components/NavbarRightDashboard";
import Footer from "../components/Footer";

// Make every field that can be null optional + allow null/undefined
interface Story {
  story_id: string;
  story_title: string;
  blurb: string;
  image_data: string | null;
  overall_rating: string | null;
  total_ratings: number | null;
  views: number | null;
  story_length: number | null;
  min_age: number;
  genre_list: string;
  created_at: string;
  author_nickname?: string;
  story_type: string;
}

const CommunityStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlurb, setSelectedBlurb] = useState<{ title: string; blurb: string } | null>(null);
  const [userAge, setUserAge] = useState<number>(0);
  const pageSize = 9;
  const router = useRouter();
  const { isAuthenticated, userId, isLoading: authLoading, accessToken } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && userId && accessToken) {
      fetchProfile();
    }
  }, [authLoading, isAuthenticated, userId, accessToken]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && userAge > 0) {
      fetchStories();
    }
  }, [currentPage, userAge, authLoading, isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${backendUrl}/users/${userId}/profile/data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setUserAge(data.profile.age || 8);
      } else {
        setUserAge(8);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      setUserAge(8);
    }
  };

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${backendUrl}/community/stories?min_age=${userAge}&page_index=${currentPage}&page_size=${pageSize}`
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.stories)) {
        // Normalize the data from Python/JSON quirks
        const normalizedStories: Story[] = data.stories.map((s: any) => ({
          story_id: s.story_id,
          story_title: s.story_title || "Untitled",
          blurb: s.blurb || "No description available.",
          image_data: s.image_data || null,
          overall_rating: s.overall_rating?.toString() || null,
          total_ratings: s.total_ratings ?? null,
          views: s.views ?? null,
          story_length: s.story_length ?? null,
          min_age: s.min_age || 8,
          genre_list: typeof s.genre_list === "string" 
            ? (JSON.parse(s.genre_list) as string[]).join(", ") || ""
            : "",
          created_at: s.created_at || new Date().toISOString(),
          author_nickname: s.author_nickname || "Anonymous",
          story_type: s.story_type || "classic",
        }));

        setStories(normalizedStories);
      } else {
        setStories([]);
      }
    } catch (error) {
      console.error("Failed to fetch community stories:", error);
      setStories([]);
      setError("Failed to load stories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // SAFE number formatting
  const formatNumber = (num: number | null | undefined): string => {
    if (num == null || isNaN(num)) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getAgeRating = (minAge: number): string => {
    if (minAge <= 8) return 'A';
    if (minAge <= 13) return 'T';
    return 'M';
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateBlurb = (text: string, maxLength = 120): string => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength).trim() + '...';
  };

  const renderStars = (rating: string | null, totalRatings: number | null) => {
    const numRating = rating ? parseFloat(rating) : 0;
    const fullStars = Math.floor(numRating);
    const hasHalf = numRating % 1 >= 0.5;

    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#FFD166" stroke="#FFD166" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star size={14} stroke="#FFD166" fill="none" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star size={14} fill="#FFD166" stroke="#FFD166" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={14} stroke="#E5E5E5" fill="none" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">{stars}</div>
        <span className="text-sm font-medium text-[#2D3436]">
          {numRating.toFixed(1)}
        </span>
        <span className="text-xs text-[#6C5CE7]">
          ({formatNumber(totalRatings)})
        </span>
      </div>
    );
  };

  const StoryCard = ({ story }: { story: Story }) => (
    <div
      className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{ backgroundColor: '#FFF8F1', border: '2px solid #E5E5E5' }}
    >
      {/* Image */}
      <div className="relative bg-[#E5E5E5] h-64">
        {story.image_data ? (
          <img
            src={`data:image/png;base64,${story.image_data}`}
            alt={story.story_title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">📖</div>
        )}
        <div
          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
          style={{
            backgroundColor:
              story.min_age <= 8 ? '#00BFA6' : story.min_age <= 13 ? '#FFD166' : '#FF7675',
          }}
        >
          {getAgeRating(story.min_age)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-[#2D3436]">
          {story.story_title}
        </h3>

        {(story.total_ratings ?? 0) > 0 && (
          <div className="mb-3">
            {renderStars(story.overall_rating, story.total_ratings)}
          </div>
        )}

        <div className="flex items-center gap-4 mb-3 text-sm flex-wrap text-[#6C5CE7]">
          {(story.views ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{formatNumber(story.views)}</span>
            </div>
          )}
          {(story.story_length ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{formatNumber(story.story_length)} words</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(story.created_at)}</span>
          </div>
        </div>

        {story.genre_list && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#74C0FC] text-[#2D3436]">
              {story.genre_list}
            </span>
          </div>
        )}

        <p className="text-sm mb-3 leading-relaxed text-[#2D3436]">
          {truncateBlurb(story.blurb)}
        </p>
        {story.blurb && story.blurb.length > 120 && (
          <button
            onClick={() => setSelectedBlurb({ title: story.story_title, blurb: story.blurb })}
            className="text-sm font-medium text-[#6C5CE7] hover:underline"
          >
            Read more
          </button>
        )}

        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
          <span className="text-sm" style={{ color: '#2D3436' }}>
            by{' '}
          </span>
          <a
            href="#"
            className="text-sm font-semibold hover:underline transition-colors"
            style={{ color: '#00BFA6' }}
            onClick={(e) => e.preventDefault()}
          >
            {story.author_nickname}
          </a>
        </div>
        <button
          onClick={() => router.push(`/generation-app?story_id=${story.story_id}&story_type=${story.story_type}`)}
          className="mt-4 w-full px-3 py-2 rounded-md bg-gradient-to-r from-[#00BFA6] to-[#6C5CE7] text-[#FFF8F1] font-medium text-sm hover:shadow-md transition-all"
        >
          Read Story
        </button>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
        Checking authentication...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent' }}>
      <NavbarRightDashboard />
      <div className="flex-1 max-w-7xl mx-auto px-6 py-26">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#6C5CE7' }}>
            Community Stories
          </h1>
          <div
            className="h-1 w-32 mx-auto rounded-full"
            style={{ backgroundColor: '#FFD166' }}
          ></div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{ borderColor: '#6C5CE7', borderTopColor: 'transparent' }}
            ></div>
            <p className="mt-4 text-lg" style={{ color: '#2D3436' }}>
              Loading magical stories...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[#FF7675] text-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stories.map((story) => (
              <StoryCard key={story.story_id} story={story} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
            style={{
              backgroundColor: '#6C5CE7',
              color: 'white',
            }}
          >
            Previous
          </button>

          {[...Array(5)].map((_, i) => {
            const pageNum = currentPage - 2 + i;
            if (pageNum < 1) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className="w-10 h-10 rounded-lg font-medium transition-all hover:shadow-md"
                style={{
                  backgroundColor: pageNum === currentPage ? '#6C5CE7' : '#E5E5E5',
                  color: pageNum === currentPage ? 'white' : '#2D3436',
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={stories.length < pageSize || loading}
            className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
            style={{
              backgroundColor: '#6C5CE7',
              color: 'white',
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Blurb Overlay */}
      {selectedBlurb && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(45, 52, 54, 0.8)' }}
          onClick={() => setSelectedBlurb(null)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl p-8 relative shadow-2xl"
            style={{ backgroundColor: '#FFF8F1' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBlurb(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-10 transition-colors"
              style={{ backgroundColor: 'transparent', color: '#6C5CE7' }}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 pr-10" style={{ color: '#6C5CE7' }}>
              {selectedBlurb.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#2D3436' }}>
              {selectedBlurb.blurb}
            </p>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
};

export default CommunityStories;