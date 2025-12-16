// _page.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StoryContent from "./components/StoryContent";

// === Persisted State Hook (Fixed) ===
function usePersistedState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
    const [state, setState] = useState<T>(defaultValue);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                setState(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
    }, [key]);

    const setValue = (value: T) => {
        try {
            setState(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error writing localStorage key "${key}":`, error);
        }
    };

    return [state, setValue];
}

// === Types ===
interface StorySegment {
    type: "text" | "decision" | "save" | "status" | "saved" | "story_complete" | "act_transition" | "act_status" | "act_title" | "act_complete" | "error";
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
    act_id?: number;
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
    rating?: number;
    last_chapter_id?: number;
    latest_chapter_id?: number;
    [key: string]: number | string | boolean | string[] | null | undefined;
}

// === COMPONENTS ===

const TopLoader = ({ isLoading }: { isLoading: boolean }) => (
    <AnimatePresence mode="wait">
        {isLoading && (
            <motion.div
                key="loader"
                className="fixed top-0 left-0 right-0 h-1 z-[1000] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div
                    className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#6C5CE7] animate-pulse"
                    style={{
                        backgroundSize: "200% 100%",
                        animation: "gradient-shift 1.5s ease infinite",
                    }}
                />
            </motion.div>
        )}
    </AnimatePresence>
);


function GenerationAppContent() {
    // === State ===
    const [storyWordCount, setStoryWordCount] = useState<number>(0);
    const [chapterWordCount, setChapterWordCount] = useState<number>(0);
    const [currentChapter, setCurrentChapter] = useState<number>(1);
    const [totalChapters, setTotalChapters] = useState<number>(1);
    const [currentActId, setCurrentActId] = useState<number>(0);
    const [currentActTitle, setCurrentActTitle] = useState<string>("");
    const [liveActTitle, setLiveActTitle] = useState<string>("");
    const [continueSceneId, setContinueSceneId] = useState<number | null>(null);
    const [textColor, setTextColor] = useState<string>("#2D3436");
    const [storyMetadata, setStoryMetadata] = useState<StoryMetadata>({});
    const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
    const [initialLoadCount, setInitialLoadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingStoryBox, setIsLoadingStoryBox] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showChapterComplete, setShowChapterComplete] = useState<boolean>(false);
    const [messageQueue, setMessageQueue] = useState<StorySegment[]>([]);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [isStoryComplete, setIsStoryComplete] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [pollingAct, setPollingAct] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [newChapterAvailable, setNewChapterAvailable] = useState<boolean>(false);
    const [initialRating, setInitialRating] = useState<number>(0);

    // === Persisted Settings ===
    const [fontFamily, setFontFamily] = usePersistedState<string>("whimsera-fontFamily", "'Inter', sans-serif");
    const [fontSize, setFontSize] = usePersistedState<number>("whimsera-fontSize", 18);
    const [isDarkMode, setIsDarkMode] = usePersistedState<boolean>("whimsera-darkMode", false);
    const [autoSave, setAutoSave] = usePersistedState<boolean>("whimsera-autoSave", false);

    // === Refs ===
    const autoSaveRef = useRef(autoSave);
    const storyEndRef = useRef<HTMLDivElement>(null!);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // === Hooks ===
    const searchParams = useSearchParams();
    const storyId = searchParams.get("story_id");
    const storyType = searchParams.get("story_type");
    const { isAuthenticated, userId, isLoading: authLoading, accessToken } = useAuth();
    const router = useRouter();
    const showLoader = authLoading;

    // === Effects ===
    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        setTextColor(isDarkMode ? "#E5E5E5" : "#2D3436");
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        autoSaveRef.current = autoSave;
    }, [autoSave]);

    // Status message auto-clear
    useEffect(() => {
        if (statusMessage) {
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
            statusTimeoutRef.current = setTimeout(() => {
                setStatusMessage(null);
            }, 10000);
        }
        return () => {
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        };
    }, [statusMessage]);

    // === Polling for Act ===
    const startPollingAct = async () => {
        if (pollingAct || currentChapter < totalChapters || currentActId > 0) return;
        setPollingAct(true);

        const poll = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
                const res = await fetch(
                    `${backendUrl}/stories/cluster/${userId}/${storyId}?story_type=${storyType}&chapter_number=${currentChapter}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const data = await res.json();

                if (res.ok && data.status === "success") {
                    const meta = data.data?.metadata ?? {};
                    const actId = meta.act_id ?? 0;
                    const actTitle = meta.act_title ?? "";

                    if (actId > 0) {
                        setCurrentActId(actId);
                        setCurrentActTitle(actTitle);
                        setChapterWordCount(meta.chapter_word_count ?? 0);
                        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                        setPollingAct(false);
                    }
                }
            } catch (err) {
                console.warn("Polling act failed, retrying...", err);
            }
        };

        await poll();
        pollIntervalRef.current = setInterval(poll, 10_000);
    };

    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []);

    const handleStoryRating = async (rating: number) => {
        if (!userId || !storyId || !accessToken) return;

        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
            await fetch(`${backendUrl}/stories/progress/${userId}/${storyId}/rating`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating }),
            });
            setStatusMessage("Thank you for rating!");
        } catch (err) {
            console.error("Failed to submit rating:", err);
        }
    };

    // === NEW: API call to update the story view state ===
    const updateStoryViewState = async (actId: number, chapterId: number, sceneId: number) => {
        if (!userId || !storyId || !accessToken) {
            console.warn("Missing required params for view state update:", { userId, storyId, accessToken });
            return;
        }
        console.log("Calling View State API Call")
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!backendUrl) {
                console.warn("Backend URL not configured");
                return;
            }

            const url = `${backendUrl}/stories/update-state/${userId}/${storyId}`;

            console.log("Sending view state update:", {
                url,
                act_id: actId,
                chapter_id: chapterId,
                scene_id: sceneId
            });
            console.log("Updating State")
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    act_id: actId,
                    chapter_id: chapterId,
                    scene_id: sceneId,
                }),
            });

            if (!response.ok) {
                console.warn("View state update failed:", response.status, response.statusText);
                return;
            }

            const data = await response.json();
            console.log("View state updated successfully:", data);

        } catch (err) {
            console.error("Failed to update story view state:", err);
        }
    };
    // === END NEW API CALL ===

    // === Fetch Story Box Content ===
    const fetchStoryBoxContent = async (chapterNum: number) => {
        setIsLoadingStoryBox(true);
        setError(null);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await fetch(
                `${backendUrl}/stories/cluster/${userId}/${storyId}?story_type=${storyType}&chapter_number=${chapterNum}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const data = await response.json();

            if (!response.ok) throw new Error(`Failed to fetch story chapter.`);
            if (data.status !== "success")
                throw new Error(data.message || "Failed to fetch story segments");

            setChapterWordCount(data.data?.metadata?.chapter_word_count || 0);
            setCurrentActId(data.data?.metadata?.act_id || 0);
            setCurrentActTitle(data.data?.metadata?.act_title || "");

            const rawText = data.data?.text;
            const iterableText = Array.isArray(rawText)
                ? rawText
                : rawText && typeof rawText === "object"
                    ? Object.values(rawText)
                    : [];

            const segments: StorySegment[] = iterableText.map((seg: unknown, idx: number) => ({
                ...(seg as StorySegment),
                id: `${Date.now()}-${idx}`,
            }));

            setStorySegments(segments);
            setInitialLoadCount(segments.length);
        } catch (err) {
            console.warn("Recoverable error loading segments:", err);
            setError(err instanceof Error ? err.message : "Failed to load chapter data.");
            setStorySegments([]);
        }
        finally {
            setIsLoadingStoryBox(false);
        }
    };

    // === WebSocket ===
    const { connect, sendChoice, continueChapter, sendMessage, disconnect, isConnected } = useWebSocket({
        userId,
        storyId,
        storyType,
        baseUrl: process.env.NEXT_PUBLIC_WS_BASE_URL || "",
        onMessage: async (message) => {
            console.log("WebSocket message received:", message);

            // NEW: Handle act_title
            if (message.type === "act_title") {
                setLiveActTitle(message.message ?? "No Title");
                return;
            }

            // 1. Chapter Complete
            if (message.chapter_complete) {
                setShowChapterComplete(true);
                setTimeout(() => setShowChapterComplete(false), 4000);
                setTotalChapters((prev) => prev + 1);
                setNewChapterAvailable(true);
                disconnect();
                return;
            }

            // 2. Status (saving chapter / saving story)
            if (message.type === "status") {
                if (message.message === "saving chapter") {
                    setStatusMessage("Saving chapter…");
                    return;
                }
                if (message.message === "saving story") {
                    setStatusMessage("Saving story…");
                    return;
                }
                if (message.message === "story complete") {
                    setIsStoryComplete(true);
                    return;
                }
                if (message.word_count !== undefined) {
                    setStoryWordCount((p) => p + (message.word_count ?? 0));
                    setChapterWordCount((p) => p + (message.word_count ?? 0));
                }
                if (message.FATAL || message.EXCEPTION) {
                    const err = message.FATAL
                        ? `Fatal Error: ${message.FATAL}`
                        : `Exception: ${message.EXCEPTION}`;
                    setError(err);
                }
                return;
            }

            // 3. Story Complete
            if (message.type === "story_complete") {
                setIsStoryComplete(true);
                const segment: StorySegment = { ...message, id: `${Date.now()}-${Math.random()}` };
                setMessageQueue((prev) => [...prev, segment]);
                return;
            }

            // 4. Act Transitions
            if (message.type === "act_transition" || message.type === "act_status") {
                const segment: StorySegment = { ...message, id: `${Date.now()}-${Math.random()}` };
                setMessageQueue((prev) => [...prev, segment]);
                return;
            }

            // 5. Error
            if (message.type === "error") {
                if (
                    message.message?.includes("monthly word count limit reached") ||
                    message.message?.includes("tier 'free'") ||
                    message.message?.includes("tier 'scribe'")
                ) {
                    setError("Your monthly word count has exceeded.");
                } else {
                    setError(message.message || "An unknown error occurred.");
                }
                return;
            }

            // 6. Saved Confirmation
            if (message.type === "saved") {
                if ((window as any)._pendingSaveAndStop) {
                    (window as any)._pendingSaveAndStop = false;
                    disconnect();
                    return;
                }
                return;
            }

            // 7. Save Handling (Auto vs Manual)
            if (message.type === "save") {
                if (autoSaveRef.current) {
                    await sendMessage({ continue_chapter: 1 });
                    return;
                } else {
                    const segment: StorySegment = {
                        ...message,
                        id: `${Date.now()}-${Math.random()}`,
                    };
                    setMessageQueue((prev) => [...prev, segment]);
                    return;
                }
            }

            // Default: Add to queue
            const segment: StorySegment = { ...message, id: `${Date.now()}-${Math.random()}` };
            setMessageQueue((prev) => [...prev, segment]);
        },
        onConnect: () => setError(null),
        onError: (err) => {
            const errMsg = err?.toString() || "";
            if (errMsg.includes("380") || errMsg.includes("monthly word count limit")) {
                setError("Your monthly word count has exceeded.");
            } else {
                setError(`Connection error: ${errMsg}`);
            }
        },
    });

    // === Message Queue Processing ===
    useEffect(() => {
        if (isStreaming || messageQueue.length === 0) return;

        const nextMessage = messageQueue[0];
        setStorySegments((prev) => [...prev, nextMessage]);
        setMessageQueue((prev) => prev.slice(1));

        if (nextMessage.type === "text") {
            setIsStreaming(true);
        }
    }, [messageQueue, isStreaming]);

    // === Initialize Story Metadata ===
    useEffect(() => {
        if (!userId || !storyId || !storyType || !accessToken) {
            if (!authLoading && (!userId || !storyId || !storyType)) {
                setError("Missing essential story information. Please start over.");
                setIsLoading(false);
            }
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
                    body: JSON.stringify({ user_id: userId, story_type: storyType }),
                });

                if (!continueResponse.ok) {
                    let errorDetail = "Failed to continue story";
                    try {
                        const errorBody = await continueResponse.json();
                        errorDetail = errorBody.detail || errorBody.message || errorDetail;
                    } catch {
                        errorDetail = continueResponse.statusText;
                    }

                    if (
                        continueResponse.status === 380 &&
                        (errorDetail.includes("monthly word count limit reached") ||
                            errorDetail.includes("tier 'free'") ||
                            errorDetail.includes("tier 'scribe'"))
                    ) {
                        setError("Your monthly word count has exceeded.");
                        setIsLoading(false);
                        return;
                    }
                    throw new Error(errorDetail);
                }

                const continueData = await continueResponse.json();
                if (continueData.status !== "success") {
                    throw new Error(continueData.message || "Failed to initialize story");
                }

                const progressResponse = await fetch(
                    `${backendUrl}/stories/progress/${userId}/${storyId}?story_type=${storyType}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const progressData = await progressResponse.json();

                if (!progressResponse.ok || progressData.status !== "success") {
                    throw new Error("Failed to fetch story metadata");
                }

                // === MODIFIED: Use last_chapter_id for total, latest_chapter_id for view state ===
                const lastChapter = progressData.data?.last_chapter_id || 1;
                const viewStateChapter = progressData.data?.latest_chapter_id || lastChapter; // Fallback if missing

                const progressRating = progressData.data?.rating || 0;
                setStoryMetadata({ ...progressData.data });

                // Set sidebar count based on last_chapter_id
                setTotalChapters(lastChapter);
                // Set initial view state based on latest_chapter_id
                setCurrentChapter(viewStateChapter);

                setStoryWordCount(progressData.data?.story_word_count || 0);
                setIsStoryComplete(progressData.data?.complete || false);
                setInitialRating(progressRating);

            } catch (err: any) {
                if (err.message?.includes("380") || err.message?.toLowerCase().includes("word count")) {
                    setError("Your monthly word count has exceeded.");
                } else {
                    setError(err instanceof Error ? err.message : "Unknown error");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initializeStory();
    }, [userId, storyId, storyType, accessToken, authLoading]);

    // === Fetch Story Segments (per chapter) ===
    useEffect(() => {
        if (!userId || !storyId || !storyType || !accessToken || currentChapter === 0 || isLoading) return;
        fetchStoryBoxContent(currentChapter);
    }, [userId, storyId, storyType, currentChapter, accessToken, isLoading]);

    // === Handlers ===
    const handleChoiceSelection = (segmentId: string, choice: string) => {
        setStorySegments((prev) =>
            prev.map((seg) =>
                seg.id === segmentId && seg.type === "decision" ? { ...seg, user_choice: choice } : seg
            )
        );
        sendChoice(choice);
    };

    const handleSaveStory = async () => {
        await continueChapter();
        setStorySegments((prev) => prev.filter((seg) => seg.type !== "save"));

        if (currentChapter === totalChapters && currentActId === 0) {
            startPollingAct();
        }
    };

    const handleRevertStory = async () => {
        sendMessage({ continue_chapter: 0 });
        setStorySegments((prev) => prev.filter((seg) => seg.type !== "save"));

        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await fetch(
                `${backendUrl}/stories/progress/${userId}/${storyId}?story_type=${storyType}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const data = await response.json();
            if (response.ok && data.status === "success") {
                setStoryWordCount(data.data?.story_word_count || 0);
                setIsStoryComplete(data.data?.complete || false);
            }
        } catch (err) {
            console.warn("Failed to update metadata on revert:", err);
        }

        fetchStoryBoxContent(currentChapter);
    };

    const handleSaveAndStop = async () => {
        setStorySegments((prev) => prev.filter((seg) => seg.type !== "save"));
        await continueChapter();
        (window as any)._pendingSaveAndStop = true;
    };

    const handleContinueStory = () => {
        if (currentChapter < totalChapters || isStoryComplete) return;
        if (!isConnected) connect();
    };

    const handleChapterChange = (chapter: number) => {
        if (chapter !== currentChapter) {
            setMessageQueue([]);
            setIsStreaming(false);
            setCurrentChapter(chapter);
            setNewChapterAvailable(false);
        }
    };

    const onStreamComplete = () => {
        setIsStreaming(false);
    };

    const isWordLimitError = error === "Your monthly word count has exceeded.";
    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-gray-900"}`}>
            <TopLoader isLoading={showLoader} />
            <Navbar isDarkMode={isDarkMode} />

            {/* Error and Confirmation Components... */}
            {error && (
                <div
                    className={`fixed top-20 right-4 z-50 max-w-md rounded-xl shadow-2xl px-6 py-4 text-white font-medium animate-slide-in ${isWordLimitError
                        ? "bg-gradient-to-r from-orange-600 to-red-600"
                        : "bg-gradient-to-r from-red-500 to-pink-500"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span>{error}</span>
                        {!isWordLimitError && (
                            <button
                                onClick={() => setError(null)}
                                className="ml-6 text-white/80 hover:text-white font-bold"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {isWordLimitError && (
                        <p className="text-sm mt-2 opacity-90">
                            Upgrade your plan to keep writing!
                        </p>
                    )}
                </div>
            )}
            {showChapterComplete && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-10 py-5 rounded-2xl shadow-2xl text-2xl font-bold animate-fade-in-out pointer-events-auto">
                        Chapter Complete!
                    </div>
                </div>
            )}

            <main className={`flex flex-col lg:flex-row flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 gap-8 ${isFullscreen ? "p-0 pt-0" : ""}`}>
                {!isFullscreen && (
                    <aside className="w-full lg:w-80 lg:flex-shrink-0">
                        <Sidebar
                            isDarkMode={isDarkMode}
                            isLoading={isLoading}
                            storyTitle={storyMetadata.story_title || "Your Story"}
                            currentChapter={currentChapter}
                            totalChapters={totalChapters}
                            onChapterChange={handleChapterChange}
                            newChapterAvailable={newChapterAvailable}
                            storyWordCount={storyWordCount}
                            chapterWordCount={chapterWordCount}
                            autoSave={autoSave}
                            setAutoSave={setAutoSave}
                            onContinueStory={handleContinueStory}
                            isConnected={isConnected}
                            isStoryComplete={isStoryComplete}
                        />
                    </aside>
                )}

                <StoryContent
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    fontFamily={fontFamily}
                    setFontFamily={setFontFamily}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    textColor={textColor}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    isFullscreen={isFullscreen}
                    setIsFullscreen={setIsFullscreen}
                    currentActId={currentActId}
                    currentActTitle={currentActTitle}
                    liveActTitle={liveActTitle}
                    statusMessage={statusMessage}
                    isLoadingStoryBox={isLoadingStoryBox}
                    storySegments={storySegments}
                    isConnected={isConnected}
                    storyEndRef={storyEndRef}
                    currentChapter={currentChapter}
                    totalChapters={totalChapters}
                    storyMetadata={storyMetadata}
                    onStreamComplete={onStreamComplete}
                    onChoiceSelection={handleChoiceSelection}
                    onSaveStory={handleSaveStory}
                    onRevertStory={handleRevertStory}
                    onSaveAndStop={handleSaveAndStop}
                    pollingAct={pollingAct}
                    isStoryComplete={isStoryComplete}
                    onRateStory={handleStoryRating}
                    initialRating={initialRating}
                    // === NEW PROP PASSING ===
                    onUpdateStoryViewState={updateStoryViewState}
                // =========================
                />
            </main>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia&family=Merriweather&family=Lora&family=Playfair+Display&family=Crimson+Text&family=Open+Sans&family=Roboto&family=Source+Code+Pro&family=Fredoka:wght@700&family=Annie+Use+Your+Telescope&display=swap');

        :root { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
        </div>
    );
}

export default function GenerationApp() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-xl font-medium text-white animate-pulse">Loading Whimsera Theatre...</div>
            </div>
        }>
            <GenerationAppContent />
        </Suspense>
    );
}