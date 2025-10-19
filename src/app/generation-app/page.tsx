"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import {
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Type,
} from "lucide-react";

interface StorySegment {
  type: "text" | "decision" | "save" | "status" | "saved";
  scene_text?: string;
  question?: string;
  options?: number;
  user_choice?: string;
  id?: string;
  word_count?: number;
  FATAL?: string;
  EXCEPTION?: string;
}

interface StoryMetadata {
  story_title?: string;
  [key: string]: number | string | undefined;
}

// --- COMPONENTS ---

// Navbar Component
// Navbar Component
function Navbar({ isDark }: { isDark: boolean }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 shadow-md transition-colors duration-300 ${isDark
          ? "bg-gray-800/80 border-b border-gray-700 backdrop-blur-sm"
          : "bg-white/80 border-b border-gray-200 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="/dashboard"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
          >
            Back to Dashboard
          </a>

          <h1
            className={`absolute left-1/2 transform -translate-x-1/2 text-lg sm:text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"
              }`}
            style={{ fontFamily: "'Annie Use Your Telescope', cursive" }}
          >
            Whimsera Story Theatre
          </h1>

          <div className="w-40"></div>
        </div>
      </div>
    </header>
  );
}
// Streaming text component with gradient effect and completion callback
function StreamingText({
  text,
  fontSize,
  fontFamily,
  textColor,
  shouldStream = true,
  onStreamComplete,
}: {
  text: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  shouldStream?: boolean;
  onStreamComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldStream) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      onStreamComplete?.();
      return;
    }

    setDisplayedText("");
    setCurrentIndex(0);
  }, [text, shouldStream]);

  const onStreamCompleteRef = useRef(onStreamComplete);
  useEffect(() => {
    onStreamCompleteRef.current = onStreamComplete;
  }, [onStreamComplete]);

  useEffect(() => {
    if (!shouldStream) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 10);
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && text.length > 0) {
      onStreamCompleteRef.current?.();
    }
  }, [currentIndex, text, shouldStream]);

  const words = displayedText.split(" ");

  return (
    <p
      className="whitespace-pre-wrap"
      style={{ fontFamily, fontSize: `${fontSize}px` }}
    >
      {words.map((word, idx) => {
        const wordIndex = displayedText.split(" ", idx).join(" ").length;
        const age = currentIndex - wordIndex;
        const isNew = age < 50 && currentIndex < text.length;

        return (
          <span
            key={idx}
            style={{
              color: isNew ? "transparent" : textColor,
              background: isNew
                ? "linear-gradient(90deg, #6C5CE7, #00BFA6, #74C0FC, #FFD166)"
                : "none",
              WebkitBackgroundClip: isNew ? "text" : "unset",
              backgroundClip: isNew ? "text" : "unset",
              transition: "all 500ms ease-out",
            }}
          >
            {word}
            {idx < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

// Loading skeleton component
function LoadingSkeleton({ isDark }: { isDark: boolean }) {
  const widths = [
    ["w-[85%]", "w-[95%]", "w-[75%]"],
    ["w-[90%]", "w-[80%]", "w-[92%]"],
    ["w-[78%]", "w-[98%]", "w-[88%]"],
  ];

  return (
    <div className="space-y-6 animate-pulse p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div
            className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} ${widths[i][0]
              }`}
          />
          <div
            className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} ${widths[i][1]
              }`}
          />
          <div
            className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} ${widths[i][2]
              }`}
          />
        </div>
      ))}
    </div>
  );
}

function GenerationAppContent() {
  // Story State
  const [wordCount, setWordCount] = useState<number>(0);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [totalChapters, setTotalChapters] = useState<number>(1);
  const [continueSceneId, setContinueSceneId] = useState<number | null>(null);
  const [storyMetadata, setStoryMetadata] = useState<StoryMetadata>({});
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [initialLoadCount, setInitialLoadCount] = useState<number>(0);

  // App Status State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [messageQueue, setMessageQueue] = useState<StorySegment[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // UI Preferences State
  const [fontFamily, setFontFamily] = useState<string>("'Inter', sans-serif");
  const [fontSize, setFontSize] = useState<number>(18);
  const [textColor, setTextColor] = useState<string>("#2D3436");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const storyId = searchParams.get("story_id");
  const storyType = searchParams.get("story_type");
  const { userId, accessToken } = useAuth();
  const storyEndRef = useRef<HTMLDivElement>(null);

  // Update text color when dark mode changes
  useEffect(() => {
    setTextColor(isDarkMode ? "#E5E5E5" : "#2D3436");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Handle logout on page close or navigation
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (userId && storyId && storyType) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          await fetch(
            `${backendUrl}/stories/logout/${userId}/${storyId}?story_type=${storyType}`,
            {
              method: "PATCH",
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
        } catch (err) {
          console.error("Failed to logout story:", err);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId, storyId, storyType, accessToken]);

  // WebSocket Hook
  const { connect, sendChoice, continueChapter, isConnected, connectionStatus } =
    useWebSocket({
      userId,
      storyId,
      storyType,
      baseUrl: process.env.NEXT_PUBLIC_WS_BASE_URL || "",
      onMessage: (message) => {
        console.log("Received message, adding to queue:", message);
        if (message.type === "status") {
          if (message.word_count !== undefined) {
            setWordCount((prev) => prev + (message.word_count ?? 0));
            return;
          }
          if (message.FATAL || message.EXCEPTION) {
            const errorMessage = message.FATAL
              ? `Fatal Error: ${message.FATAL}`
              : `Exception: ${message.EXCEPTION}`;
            setError(errorMessage);
            return;
          }
          return;
        }

        if (message.type === "saved") {
          setShowSaveConfirmation(true);
          setTimeout(() => setShowSaveConfirmation(false), 3000);
          return;
        }

        const segment: StorySegment = {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
        };
        setMessageQueue((prev) => [...prev, segment]);
      },
      onConnect: () => setError(null),
      onError: (err) => setError(`WebSocket error: ${err}`),
    });

  // Message Queue Processor
  useEffect(() => {
    if (isStreaming || messageQueue.length === 0) return;

    const nextMessage = messageQueue[0];
    setStorySegments((prev) => [...prev, nextMessage]);
    setMessageQueue((prev) => prev.slice(1));

    if (nextMessage.type === "text") {
      setIsStreaming(true);
    }
  }, [messageQueue, isStreaming]);

  // Scroll to bottom effect
  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storySegments]);

  // Fetch Story Segments (for initial load and chapter change)
  useEffect(() => {
    if (!userId || !storyId || !storyType) return;

    const fetchStorySegments = async () => {
      setIsLoading(true);
      setError(null);
      setStorySegments([]);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(
          `${backendUrl}/stories/cluster/${userId}/${storyId}?story_type=${storyType}&chapter_number=${currentChapter}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!response.ok) throw new Error(`Failed to fetch story chapter.`);
        const data = await response.json();
        if (data.status !== "success")
          throw new Error(data.message || "Failed to fetch story segments");

        const segments: StorySegment[] = (data.data || []).map(
          (seg: unknown, idx: number) => ({
            ...(seg as StorySegment),
            id: `${Date.now()}-${idx}`,
          })
        );

        setStorySegments(segments);
        setInitialLoadCount(segments.length);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load story: ${err.message}.`);
        } else {
          setError("Failed to load story: Unknown error.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStorySegments();
  }, [userId, storyId, storyType, currentChapter, accessToken]);

  // Fetch Story Metadata (on initial page load)
  useEffect(() => {
    if (!userId || !storyId || !storyType) {
      setError("Missing essential story information. Please start over.");
      setIsLoading(false);
      return;
    }

    const fetchStoryMetadata = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/stories/progress/${userId}/${storyId}?story_type=${storyType}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch story metadata.");
        const data = await response.json();
        if (data.status !== "success")
          throw new Error(data.message || "Failed to fetch story metadata");

        const latestChapter = data.data?.latest_chapter_id || 1;
        setStoryMetadata(data.data?.metadata || {});
        setCurrentChapter(latestChapter);
        setTotalChapters(latestChapter);
        setContinueSceneId(data.data?.continue_scene_id || null);
        setWordCount(data.data?.word_count || 0);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load story metadata: ${err.message}.`);
        } else {
          setError("Failed to load story metadata: Unknown error.");
        }
      }
      // setIsLoading(false) is handled by the other useEffect
    };

    fetchStoryMetadata();
  }, [userId, storyId, storyType, accessToken]);

  // --- HANDLERS ---
  const handleChoiceSelection = (segmentId: string, choice: string) => {
    setStorySegments((prev) =>
      prev.map((seg) =>
        seg.id === segmentId && seg.type === "decision"
          ? { ...seg, user_choice: choice }
          : seg
      )
    );
    sendChoice(choice);
  };

  const handleSaveStory = () => {
    continueChapter();
    setStorySegments((prev) => prev.filter((seg) => seg.type !== "save"));
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const handleContinueStory = () => {
    if (currentChapter === totalChapters) {
      connect();
    }
  };

  const handleChapterChange = (chapter: number) => {
    if (chapter !== currentChapter) {
      setMessageQueue([]);
      setIsStreaming(false);
      setCurrentChapter(chapter);
    }
  };

  // --- RENDER LOGIC ---
  const renderSegment = (segment: StorySegment, index: number) => {
    const shouldStreamText = index >= initialLoadCount;

    switch (segment.type) {
      case "text":
        return (
          <div key={segment.id || index} className="mb-6">
            <StreamingText
              text={segment.scene_text || ""}
              fontSize={fontSize}
              fontFamily={fontFamily}
              textColor={textColor}
              shouldStream={shouldStreamText}
              onStreamComplete={() => setIsStreaming(false)}
            />
          </div>
        );
      case "decision":
        const optionLabels = ["Option A", "Option B", "Option C", "Option D"];
        return (
          <div
            key={segment.id || index}
            className={`mb-6 p-6 rounded-xl shadow-lg transition-all ${isDarkMode
                ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/50"
                : "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200"
              }`}
          >
            <p
              className={`font-semibold mb-4 text-lg ${isDarkMode ? "text-indigo-200" : "text-indigo-900"
                }`}
            >
              {segment.question}
            </p>
            <div className="space-y-3">
              {Array.from({ length: segment.options || 2 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    !segment.user_choice &&
                    handleChoiceSelection(segment.id!, optionLabels[idx])
                  }
                  disabled={!!segment.user_choice}
                  className={`w-full text-left px-5 py-4 rounded-lg font-medium transition-all transform ${segment.user_choice === optionLabels[idx]
                      ? isDarkMode
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-[1.02]"
                      : !!segment.user_choice
                        ? isDarkMode
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isDarkMode
                          ? "bg-gray-800/50 text-gray-200 border border-indigo-700/30 hover:bg-gray-700/50 hover:border-indigo-600/50 hover:scale-[1.01]"
                          : "bg-white text-gray-800 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:scale-[1.01]"
                    }`}
                >
                  {optionLabels[idx]}
                </button>
              ))}
            </div>
          </div>
        );
      case "save":
        return (
          <div
            key={segment.id || index}
            className={`mb-6 p-6 rounded-xl text-center shadow-lg ${isDarkMode
                ? "bg-gradient-to-br from-teal-900/40 to-green-900/40 border border-teal-700/50"
                : "bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200"
              }`}
          >
            <p
              className={`mb-4 text-lg font-medium ${isDarkMode ? "text-teal-200" : "text-teal-900"
                }`}
            >
              Would you like to save your story progress?
            </p>
            <button
              onClick={handleSaveStory}
              className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${isDarkMode
                  ? "bg-gradient-to-r from-teal-600 to-green-600 text-white hover:shadow-teal-500/50"
                  : "bg-gradient-to-r from-teal-500 to-green-500 text-white hover:shadow-teal-400/50"
                }`}
            >
              Save Story
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const sidebarContent = (
    <div
      className={`rounded-2xl p-6 shadow-xl sticky top-24 transition-colors ${isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
        }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {storyMetadata.story_title || "Your Story"}
      </h2>
      <div
        className={`space-y-4 mb-6 pb-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
      >
        <div className="flex justify-between items-center">
          <label htmlFor="chapter-select" className="font-semibold text-sm">
            Chapter:
          </label>
          <select
            id="chapter-select"
            value={currentChapter}
            onChange={(e) => handleChapterChange(Number(e.target.value))}
            disabled={isLoading || isConnected}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold w-28 text-center ${isDarkMode
                ? "bg-indigo-900/40 text-indigo-300 border border-indigo-700/50"
                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
              }`}
          >
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num} / {totalChapters}
                </option>
              )
            )}
          </select>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Word Count:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${isDarkMode
                ? "bg-teal-900/40 text-teal-300"
                : "bg-teal-100 text-teal-700"
              }`}
          >
            {wordCount.toLocaleString()}
          </span>
        </div>
        {continueSceneId && currentChapter === totalChapters && (
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">Scene:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${isDarkMode
                  ? "bg-purple-900/40 text-purple-300"
                  : "bg-purple-100 text-purple-700"
                }`}
            >
              {continueSceneId}
            </span>
          </div>
        )}
      </div>
      <div
        className={`mb-6 pb-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
      >
        <p className="text-xs font-semibold mb-2 uppercase tracking-wide opacity-70">
          Connection Status
        </p>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isConnected
                ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                : "bg-gray-400"
              }`}
          />
          <p
            className={`text-sm font-medium ${isConnected
                ? isDarkMode
                  ? "text-green-400"
                  : "text-green-600"
                : "text-gray-500"
              }`}
          >
            {connectionStatus}
          </p>
        </div>
      </div>
      <button
        onClick={handleContinueStory}
        disabled={isConnected || currentChapter < totalChapters}
        className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg ${isConnected || currentChapter < totalChapters
            ? isDarkMode
              ? "bg-gray-700 cursor-not-allowed text-gray-500"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-xl"
          }`}
      >
        {isConnected
          ? "✨ Generating..."
          : currentChapter < totalChapters
            ? "Viewing Old Chapter"
            : "Continue Story"}
      </button>
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-gray-900"
        }`}
    >
      <Navbar isDark={isDarkMode} />

      {error && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-2xl z-50 max-w-md animate-slide-in">
          {error}
          <button
            className="ml-4 text-white underline font-medium"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      )}
      {showSaveConfirmation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-green-500 text-white px-10 py-5 rounded-2xl shadow-2xl z-50 text-xl font-bold animate-bounce-in">
          ✨ Story Saved
        </div>
      )}
      {isLoading && storySegments.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="text-white text-xl font-medium animate-pulse">
            Loading story...
          </div>
        </div>
      )}

      <main
        className={`flex flex-col lg:flex-row flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 gap-8 ${isFullscreen ? "p-0 pt-0" : ""
          }`}
      >
        {!isFullscreen && (
          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            {sidebarContent}
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div
            className={`rounded-xl shadow-lg overflow-y-auto transition-all ${isFullscreen
                ? "fixed inset-0 z-50 rounded-none"
                : "h-full max-h-[calc(100vh-150px)]"
              } ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
              }`}
          >
            {isFullscreen && (
              <div
                className={`sticky top-0 z-10 flex items-center justify-between p-4 ${isDarkMode ? "bg-gray-900/95" : "bg-white/95"
                  } backdrop-blur-sm border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
              >
                <div className="flex-1"></div>
                <span className="text-lg font-bold">
                  {storyMetadata.story_title}
                </span>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode
                        ? "hover:bg-gray-800 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <Minimize2 size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className={`p-6 sm:p-8 lg:p-12 ${isFullscreen ? "max-w-4xl mx-auto" : ""}`}>
              {!isFullscreen && (
                <div
                  className={`flex items-center justify-between mb-6 pb-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                >
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                      }`}
                    title="Text Settings"
                  >
                    <Type size={20} />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                          : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        }`}
                      title={isDarkMode ? "Light Mode" : "Dark Mode"}
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                        }`}
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                  </div>
                </div>
              )}
              {showSettings && !isFullscreen && (
                <div
                  className={`flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg animate-fade-in ${isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                    }`}
                >
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Font</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className={`rounded-lg px-3 py-1.5 text-sm ${isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-white text-gray-800"
                        }`}
                    >
                      {[
                        "'Inter', sans-serif",
                        "'Georgia', serif",
                        "'Merriweather', serif",
                        "'Lora', serif",
                        "'Playfair Display', serif",
                        "'Crimson Text', serif",
                        "'Open Sans', sans-serif",
                        "'Roboto', sans-serif",
                        "'Source Code Pro', monospace",
                      ].map((font) => (
                        <option key={font} value={font}>
                          {font.split(",")[0].replace(/'/g, "")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className={`rounded-lg px-3 py-1.5 text-sm ${isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-white text-gray-800"
                        }`}
                    >
                      {[14, 16, 18, 20, 22, 24].map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {isLoading && storySegments.length === 0 ? (
                <LoadingSkeleton isDark={isDarkMode} />
              ) : storySegments.length > 0 ? (
                <>
                  {storySegments.map((segment, index) =>
                    renderSegment(segment, index)
                  )}
                  {isConnected && <LoadingSkeleton isDark={isDarkMode} />}
                  <div ref={storyEndRef} />
                </>
              ) : (
                <p
                  className={`italic text-center py-10 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  {currentChapter < totalChapters
                    ? `Viewing Chapter ${currentChapter}. Select the latest chapter to continue.`
                    : 'Click "Continue Story" to begin.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia&family=Merriweather&family=Lora&family=Playfair+Display&family=Crimson+Text&family=Open+Sans&family=Roboto&family=Source+Code+Pro&family=Fredoka:wght@700&family=Annie+Use+Your+Telescope&display=swap');
        
        :root { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: translate(-50%, -60%) scale(0.3); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          70% { transform: translate(-50%, -50%) scale(0.9); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${isDarkMode ? "#1F2937" : "#F3F4F6"
        }; }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "#4F46E5" : "#4338CA"};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "#6366F1" : "#312E81"};
        }
      `}</style>
    </div>
  );
}

export default function GenerationApp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-xl font-medium text-white animate-pulse">
            Loading Story Engine...
          </div>
        </div>
      }
    >
      <GenerationAppContent />
    </Suspense>
  );
}