"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import {
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Type,
  MessageCircle,
} from "lucide-react";

interface StorySegment {
  type: "text" | "decision" | "save" | "status" | "saved" | "story_complete" | "act_transition" | "act_status" | "error";
  scene_text?: string;
  question?: string;
  options?: number;
  user_choice?: string;
  id?: string;
  story_word_count?: number;
  chapter_word_count?: number;
  word_count?: number;
  chapter_complete?: boolean;
  FATAL?: string;
  EXCEPTION?: string;
  message?: string;
  current_act_id?: number;
  total_acts?: number;
  act_title?: string;
  progress_percentage?: number;
  latest_chapter_id?: number;
}

interface StoryMetadata {
  story_title?: string | null;
  complete?: boolean;
  current_act_id?: number;
  total_acts?: number;
  target_length?: number;
  pov?: string | null;
  genre?: string[];
  story_type?: string;
  tone_temp?: string | null;
  model?: string | null;
  blurb?: string | null;
  image_data?: string | null;
  public?: boolean;
  [key: string]: number | string | boolean | string[] | null | undefined;
}

// --- COMPONENTS ---

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

          <div className="flex items-center space-x-2">
            <a
              href="/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all hover:scale-105 ${isDark
                  ? "text-gray-300 hover:bg-gray-700/50 hover:text-orange-400"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                }`}
              title="Send Feedback"
            >
              <MessageCircle size={20} />
            </a>
            <div className="w-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

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
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const lines = text.split('\n').filter(line => line.trim() !== '');

  useEffect(() => {
    if (!shouldStream) {
      setDisplayedText(text);
      onStreamComplete?.();
      return;
    }

    setDisplayedText(lines.slice(0, 1).join('\n'));
    setCurrentLine(1);
  }, [text, shouldStream]);

  const onStreamCompleteRef = useRef(onStreamComplete);
  useEffect(() => {
    onStreamCompleteRef.current = onStreamComplete;
  }, [onStreamComplete]);

  useEffect(() => {
    if (!shouldStream || currentLine >= lines.length) return;

    setIsTyping(true);
    const timer = setTimeout(() => {
      setDisplayedText(lines.slice(0, currentLine + 1).join('\n'));
      setCurrentLine(currentLine + 1);
      setIsTyping(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentLine, lines, shouldStream]);

  useEffect(() => {
    if (currentLine >= lines.length && lines.length > 0) {
      onStreamCompleteRef.current?.();
    }
  }, [currentLine, lines.length]);

  return (
    <p
      className="whitespace-pre-wrap"
      style={{ fontFamily, fontSize: `${fontSize}px`, color: textColor }}
    >
      {displayedText}
      {isTyping && currentLine < lines.length && (
        <span className="inline-block w-2 h-4 bg-current ml-1 animate-blink" />
      )}
    </p>
  );
}

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
  const [storyWordCount, setStoryWordCount] = useState<number>(0);
  const [chapterWordCount, setChapterWordCount] = useState<number>(0);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [totalChapters, setTotalChapters] = useState<number>(1);
  const [continueSceneId, setContinueSceneId] = useState<number | null>(null);
  const [storyMetadata, setStoryMetadata] = useState<StoryMetadata>({});
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [initialLoadCount, setInitialLoadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  const [messageQueue, setMessageQueue] = useState<StorySegment[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isStoryComplete, setIsStoryComplete] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<string>("'Inter', sans-serif");
  const [fontSize, setFontSize] = useState<number>(18);
  const [textColor, setTextColor] = useState<string>("#2D3436");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentActTitle, setCurrentActTitle] = useState<string>("");
  const [currentActId, setCurrentActId] = useState<number>(1);

  const searchParams = useSearchParams();
  const storyId = searchParams.get("story_id");
  const storyType = searchParams.get("story_type");
  const { isAuthenticated, userId, isLoading: authLoading, accessToken } = useAuth();
  const storyEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const showLoader = authLoading;

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    setTextColor(isDarkMode ? "#E5E5E5" : "#2D3436");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const { connect, sendChoice, continueChapter, sendMessage, isConnected } = useWebSocket({
    userId,
    storyId,
    storyType,
    baseUrl: process.env.NEXT_PUBLIC_WS_BASE_URL || "",
    onMessage: (message) => {
      console.log("WebSocket message received:", message);

      // Handle chapter completion
      if (message.chapter_complete) {
        console.log("Chapter complete received, clearing story and updating chapter");
        setStorySegments([]);
        setChapterWordCount(0);
        setTotalChapters(prev => prev + 1);
        setCurrentChapter(prev => prev + 1);
        return;
      }

      if (message.type === "status") {
        if (message.message === "story complete") {
          setIsStoryComplete(true);
          return;
        }
        if (message.word_count !== undefined) {
          setStoryWordCount((prev) => prev + (message.word_count ?? 0));
          // Only update chapter word count if on latest chapter
          if (currentChapter === totalChapters) {
            setChapterWordCount((prev) => prev + (message.word_count ?? 0));
          }
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

      if (message.type === "story_complete") {
        setIsStoryComplete(true);
        const segment: StorySegment = {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
        };
        setMessageQueue((prev) => [...prev, segment]);
        return;
      }

      if (message.type === "act_transition" || message.type === "act_status") {
        const segment: StorySegment = {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
        };
        setMessageQueue((prev) => [...prev, segment]);
        return;
      }

      if (message.type === "error") {
        setError(message.message || "Unknown error");
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

  useEffect(() => {
    if (isStreaming || messageQueue.length === 0) return;
    const nextMessage = messageQueue[0];
    setStorySegments((prev) => [...prev, nextMessage]);
    setMessageQueue((prev) => prev.slice(1));
    if (nextMessage.type === "text") {
      setIsStreaming(true);
    }
  }, [messageQueue, isStreaming]);

  // Initialize story metadata
  useEffect(() => {
    if (!userId || !storyId || !storyType) {
      setError("Missing essential story information. Please start over.");
      setIsLoading(false);
      return;
    }

    const initializeStory = async () => {
      setIsLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const continueResponse = await fetch(`${backendUrl}/stories/${storyId}`, {
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
        const continueData = await continueResponse.json();
        if (!continueResponse.ok || continueData.status !== "success") {
          throw new Error(continueData.message || "Failed to initialize story");
        }

        const progressResponse = await fetch(
          `${backendUrl}/stories/progress/${userId}/${storyId}?story_type=${storyType}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const progressData = await progressResponse.json();
        if (!progressResponse.ok) throw new Error("Failed to fetch story metadata.");
        if (progressData.status !== "success")
          throw new Error(progressData.message || "Failed to fetch story metadata");

        const latestChapter = progressData.data?.latest_chapter_id || 1;
        setStoryMetadata({
          story_title: progressData.data?.story_title || "Untitled Story",
          complete: progressData.data?.complete || false,
          current_act_id: progressData.data?.current_act_id || 1,
          total_acts: progressData.data?.total_acts || 1,
          target_length: progressData.data?.target_length || 0,
          pov: progressData.data?.pov || null,
          genre: progressData.data?.genre || [],
          story_type: progressData.data?.story_type || storyType,
          tone_temp: progressData.data?.tone_temp || null,
          model: progressData.data?.model || null,
          blurb: progressData.data?.blurb || null,
          image_data: progressData.data?.image_data || null,
          public: progressData.data?.public || false,
        });
        setCurrentChapter(latestChapter);
        setTotalChapters(latestChapter);
        setContinueSceneId(progressData.data?.continue_scene_id || null);
        setStoryWordCount(progressData.data?.story_word_count || 0);
        setIsStoryComplete(progressData.data?.complete || false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to initialize story: ${err.message}.`);
        } else {
          setError("Failed to initialize story: Unknown error.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeStory();
  }, [userId, storyId, storyType, accessToken]);

  // Fetch story cluster (segments + metadata per chapter)
  useEffect(() => {
    if (!userId || !storyId || !storyType || !currentChapter) return;

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
        const data = await response.json();
        if (!response.ok) throw new Error(`Failed to fetch story chapter.`);
        if (data.status !== "success")
          throw new Error(data.message || "Failed to fetch story segments");

        const segments: StorySegment[] = (data.data?.segments || []).map(
          (seg: unknown, idx: number) => ({
            ...(seg as StorySegment),
            id: `${Date.now()}-${idx}`,
          })
        );

        // Extract metadata from cluster call
        const metadata = data.data?.metadata;
        if (metadata) {
          setChapterWordCount(metadata.chapter_word_count || 0);
          setCurrentActId(metadata.act_id || 1);
          setCurrentActTitle(metadata.act_title || `Act ${metadata.act_id}`);
        }

        setStorySegments(segments);
        setInitialLoadCount(segments.length);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load story segments: ${err.message}.`);
        } else {
          setError("Failed to load story segments: Unknown error.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStorySegments();
  }, [userId, storyId, storyType, currentChapter, accessToken]);

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

  const handleRevertStory = async () => {
    const message = { continue_chapter: 0 };
    if (isConnected) {
      sendMessage(message);
    }
    setStorySegments((prev) => prev.filter((seg) => seg.type !== "save"));

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${backendUrl}/stories/progress/${userId}/${storyId}?story_type=${storyType}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      if (!response.ok) throw new Error("Failed to fetch story metadata.");
      if (data.status !== "success")
        throw new Error(data.message || "Failed to fetch story metadata");

      setStoryWordCount(data.data?.story_word_count || 0);
      setIsStoryComplete(data.data?.complete || false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to update story metadata: ${err.message}.`);
      }
    }

    // Re-fetch current chapter cluster to update word count & act info
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${backendUrl}/stories/cluster/${userId}/${storyId}?story_type=${storyType}&chapter_number=${currentChapter}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await response.json();
    if (response.ok && data.status === "success") {
      const metadata = data.data?.metadata;
      if (metadata) {
        setChapterWordCount(metadata.chapter_word_count || 0);
        setCurrentActId(metadata.act_id || 1);
        setCurrentActTitle(metadata.act_title || `Act ${metadata.act_id}`);
      }
      const segments: StorySegment[] = (data.data?.segments || []).map(
        (seg: unknown, idx: number) => ({
          ...(seg as StorySegment),
          id: `${Date.now()}-${idx}`,
        })
      );
      setStorySegments(segments);
      setInitialLoadCount(segments.length);
    }
  };

  const handleContinueStory = () => {
    if (currentChapter === totalChapters && !isStoryComplete) {
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
            className={`mb-6 p-6 rounded-xl shadow-lg transition-all ${
              isDarkMode
                ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/50"
                : "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200"
            }`}
          >
            <p
              className={`font-semibold mb-4 text-lg ${
                isDarkMode ? "text-indigo-200" : "text-indigo-900"
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
                  className={`w-full text-left px-5 py-4 rounded-lg font-medium transition-all transform ${
                    segment.user_choice === optionLabels[idx]
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
            className={`mb-6 p-6 rounded-xl text-center shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-teal-900/40 to-green-900/40 border border-teal-700/50"
                : "bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200"
            }`}
          >
            <p
              className={`mb-4 text-lg font-medium ${
                isDarkMode ? "text-teal-200" : "text-teal-900"
              }`}
            >
              Would you like to save your story progress?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSaveStory}
                className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                  isDarkMode
                    ? "bg-gradient-to-r from-teal-600 to-green-600 text-white hover:shadow-teal-500/50"
                    : "bg-gradient-to-r from-teal-500 to-green-500 text-white hover:shadow-teal-400/50"
                }`}
              >
                Save Story
              </button>
              <button
                onClick={handleRevertStory}
                className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                  isDarkMode
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-red-500/50"
                    : "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-red-400/50"
                }`}
              >
                Revert to Previous Save
              </button>
            </div>
          </div>
        );
      case "act_transition":
        return (
          <div
            key={segment.id || index}
            className={`mb-6 p-6 rounded-xl shadow-lg text-center ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50"
                : "bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200"
            }`}
          >
            <p
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-purple-200" : "text-purple-900"
              }`}
            >
              Act {segment.current_act_id} of {segment.total_acts}: {segment.act_title}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Progress: {(segment.progress_percentage || 0).toFixed(1)}%
            </p>
          </div>
        );
      case "act_status":
        return (
          <div
            key={segment.id || index}
            className={`mb-6 p-6 rounded-xl shadow-lg text-center ${
              isDarkMode
                ? "bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200"
            }`}
          >
            <p
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-blue-200" : "text-blue-900"
              }`}
            >
              Act {segment.current_act_id} of {segment.total_acts}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Chapter {segment.latest_chapter_id} | Progress: {(segment.progress_percentage || 0).toFixed(1)}%
            </p>
          </div>
        );
      case "story_complete":
        return (
          <div
            key={segment.id || index}
            className={`mb-6 p-6 rounded-xl shadow-lg text-center ${
              isDarkMode
                ? "bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-700/50"
                : "bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200"
            }`}
          >
            <p
              className={`text-lg font-semibold ${
                isDarkMode ? "text-green-200" : "text-green-900"
              }`}
            >
              Story Complete
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {segment.message || "The story has concluded."}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // Sidebar with Act Info
  const sidebarContent = (
    <div
      className={`rounded-2xl p-6 shadow-xl sticky top-24 transition-colors ${
        isDarkMode
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
        className={`space-y-4 mb-6 pb-6 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
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
            className={`rounded-lg px-3 py-1.5 text-sm font-bold w-28 text-center ${
              isDarkMode
                ? "bg-indigo-900/40 text-indigo-300 border border-indigo-700/50"
                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
            }`}
          >
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} / {totalChapters}
              </option>
            ))}
          </select>
        </div>

        {/* Act Info */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Act:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              isDarkMode ? "bg-orange-900/40 text-orange-300" : "bg-orange-100 text-orange-700"
            }`}
          >
            {currentActId}: {currentActTitle}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Story Word Count:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              isDarkMode ? "bg-teal-900/40 text-teal-300" : "bg-teal-100 text-teal-700"
            }`}
          >
            {storyWordCount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Chapter Word Count:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              isDarkMode ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700"
            }`}
          >
            {chapterWordCount.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handleContinueStory}
        disabled={isConnected || currentChapter < totalChapters || isStoryComplete}
        className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg ${
          isConnected || currentChapter < totalChapters || isStoryComplete
            ? isDarkMode
              ? "bg-gray-700 cursor-not-allowed text-gray-500"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-xl"
        }`}
      >
        {isStoryComplete
          ? "Story Complete"
          : isConnected
          ? "Generating..."
          : currentChapter < totalChapters
          ? "Viewing Old Chapter"
          : "Continue Story"}
      </button>
    </div>
  );

  // Show loading until cluster is loaded
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2D3436]">
        <TopLoader isLoading={true} />
        {authLoading ? "Checking authentication..." : "Loading story chapter..."}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-gray-900"
      }`}
    >
      <TopLoader isLoading={showLoader} />
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
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-10 py-5 rounded-2xl shadow-2xl text-xl font-bold animate-bounce-in pointer-events-auto">
            Story Saved
          </div>
        </div>
      )}
      <main
        className={`flex flex-col lg:flex-row flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 gap-8 ${
          isFullscreen ? "p-0 pt-0" : ""
        }`}
      >
        {!isFullscreen && (
          <aside className="w-full lg:w-80 lg:flex-shrink-0">{sidebarContent}</aside>
        )}
        <div className="flex-1 min-w-0">
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition-all ${
              isFullscreen
                ? "fixed inset-0 z-50 rounded-none"
                : "h-full max-h-[calc(100vh-150px)]"
            } ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            {/* Sticky Top Bar */}
            <div
              className={`sticky top-0 z-20 backdrop-blur-sm border-b ${
                isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
              }`}
            >
              {/* ... (top bar unchanged) */}
            </div>

            {/* Scrollable Content */}
            <div
              className={`overflow-y-auto p-6 sm:p-8 lg:p-12 ${
                isFullscreen ? "max-w-4xl mx-auto h-[calc(100vh-80px)]" : "h-[calc(100%-80px)]"
              }`}
            >
              {storySegments.length > 0 ? (
                <>
                  {storySegments.map((segment, index) => renderSegment(segment, index))}
                  {isConnected && <LoadingSkeleton isDark={isDarkMode} />}
                  <div ref={storyEndRef} />
                </>
              ) : (
                <p
                  className={`italic text-center py-10 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {currentChapter < totalChapters
                    ? `Viewing Chapter ${currentChapter}. Select the latest chapter to continue.`
                    : isStoryComplete
                    ? "The story has concluded."
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
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-blink { animation: blink 1s infinite; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? "#1F2937" : "#F3F4F6"};
        }
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
            Loading Whimsera Story Theatre...
          </div>
        </div>
      }
    >
      <GenerationAppContent />
    </Suspense>
  );
}