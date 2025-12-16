// components/StoryContent.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Moon, Sun, Type } from "lucide-react";

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

interface StoryContentProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    fontFamily: string;
    setFontFamily: (value: string) => void;
    fontSize: number;
    setFontSize: (value: number) => void;
    textColor: string;
    showSettings: boolean;
    setShowSettings: (value: boolean) => void;
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean) => void;
    currentActId: number;
    currentActTitle: string;
    liveActTitle: string;
    statusMessage: string | null;
    isLoadingStoryBox: boolean;
    storySegments: StorySegment[];
    isConnected: boolean;
    storyEndRef: React.RefObject<HTMLDivElement>;
    currentChapter: number;
    totalChapters: number;
    storyMetadata: { story_title?: string | null;[key: string]: any };
    onStreamComplete: () => void;
    onChoiceSelection: (segmentId: string, choice: string) => void;
    onSaveStory: () => void;
    onRevertStory: () => void;
    onSaveAndStop: () => void;
    pollingAct: boolean;
    isStoryComplete: boolean;
    onRateStory?: (rating: number) => void;
    initialRating: number;
    onUpdateStoryViewState: (actId: number, chapterId: number, sceneId: number) => void;
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
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!shouldStream) {
            setDisplayedText(text);
            setIsComplete(true);
            onStreamComplete?.();
            return;
        }

        setDisplayedText(text);
        setIsComplete(true);

        const timer = setTimeout(() => {
            onStreamComplete?.();
        }, 100);

        return () => clearTimeout(timer);
    }, [text, shouldStream, onStreamComplete]);

    return (
        <p
            className="whitespace-pre-wrap"
            style={{ fontFamily, fontSize: `${fontSize}px`, color: textColor }}
        >
            {displayedText}
            {!isComplete && (
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
                        className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} ${widths[i][0]}`}
                    />
                    <div
                        className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} ${widths[i][1]}`}
                    />
                    <div
                        className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} ${widths[i][2]}`}
                    />
                </div>
            ))}
        </div>
    );
}

function SubtleStatusMessage({ message, isDark }: { message: string; isDark: boolean }) {
    return (
        <div
            className={`text-center py-3 mb-4 text-sm font-medium animate-fade-in-out ${isDark ? "text-gray-400" : "text-gray-500"
                }`}
        >
            {message}
        </div>
    );
}

export default function StoryContent(props: StoryContentProps) {

    const {
        isDarkMode,
        setIsDarkMode,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        textColor,
        showSettings,
        setShowSettings,
        isFullscreen,
        setIsFullscreen,
        currentActId,
        currentActTitle,
        liveActTitle,
        statusMessage,
        isLoadingStoryBox,
        storySegments,
        isConnected,
        storyEndRef,
        currentChapter,
        totalChapters,
        storyMetadata,
        onStreamComplete,
        onChoiceSelection,
        onSaveStory,
        onRevertStory,
        onSaveAndStop,
        pollingAct,
        isStoryComplete,
        initialRating,
        onUpdateStoryViewState,
    } = props;

    const [showRatingPrompt, setShowRatingPrompt] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [hasDismissedRating, setHasDismissedRating] = useState(false);
    const [isActTransitionScreen, setIsActTransitionScreen] = useState(false);

    // === NEW STATE & REFS FOR VIEW STATE ===
    const [sceneRefs, setSceneRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentVisibleSceneIdRef = useRef<number | null>(null);
    // ======================================


    useEffect(() => {
        const hasTransition = storySegments.some(s => s.type === "act_transition");
        setIsActTransitionScreen(hasTransition);
    }, [storySegments]);

    useEffect(() => {
        // RATING LOGIC
        const hasNotRated = initialRating === 0;

        if (isStoryComplete && hasNotRated && !hasRated && !hasDismissedRating && !showRatingPrompt) {
            setShowRatingPrompt(true);
        }
    }, [isStoryComplete, initialRating, hasRated, hasDismissedRating, showRatingPrompt]);

    // === NEW EFFECT: Manage Scene Refs ===
    useEffect(() => {
        const textSegmentsCount = storySegments.filter(s => s.type === 'text').length;
        // Create or resize the refs array to match the number of text segments
        setSceneRefs(refs =>
            Array(textSegmentsCount).fill(null).map((_, i) => refs[i] || React.createRef())
        );
        // Reset the visible scene index when segments change (e.g. new chapter loaded)
        currentVisibleSceneIdRef.current = null;

    }, [storySegments]);
    // ======================================

    // === MODIFIED EFFECT: Intersection Observer & Periodic Update ===
    useEffect(() => {
        // Only run if the story is complete and we have segments to observe
        if (!isStoryComplete) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        // Find the scrollable container
        const storySegmentsContainer = document.querySelector('[class*="overflow-y-auto"]');
        if (!storySegmentsContainer) {
            console.warn("Story segments container not found");
            return;
        }

        // --- Intersection Observer Logic ---
        const observer = new IntersectionObserver(
            (entries) => {
                let topmostVisibleId: number | null = null;

                // Find the segment closest to the top (smallest scene-id) that is intersecting
                for (const entry of entries) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0) {
                        const id = parseInt(entry.target.getAttribute('data-scene-id') || '-1');
                        if (id !== -1) {
                            if (topmostVisibleId === null || id < topmostVisibleId) {
                                topmostVisibleId = id;
                            }
                        }
                    }
                }

                // Update the ref to the currently visible scene index (0-indexed)
                if (topmostVisibleId !== null) {
                    currentVisibleSceneIdRef.current = topmostVisibleId;
                }
            },
            {
                root: storySegmentsContainer,
                // Detect elements when they're in the top 50% of the viewport
                rootMargin: '0px 0px -50% 0px',
                threshold: 0.01,
            }
        );

        // Observe all segment refs
        sceneRefs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        // --- Periodic Update Logic ---
        const updateState = () => {
            let currentSceneId = currentVisibleSceneIdRef.current;

            // Fallback: if no intersection detected (user at bottom), use last scene
            if (currentSceneId === null && sceneRefs.length > 0) {
                currentSceneId = sceneRefs.length - 1;
            }

            if (currentSceneId !== null) {
                const sceneIdToSend = currentSceneId + 1;
                onUpdateStoryViewState(currentActId, currentChapter, sceneIdToSend);
            }
        };

        // Start interval for periodic API calls (every 30 seconds)
        // Note: We do NOT call updateState() immediately here, only on interval.
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(updateState, 30000);
        
        // Add this after setting the interval
        setTimeout(updateState, 8000); // Give user time to read "The End"
        return () => {
            // Cleanup
            observer.disconnect();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

    }, [isStoryComplete, currentActId, currentChapter, onUpdateStoryViewState, sceneRefs]);
    // ======================================


    const isShowingActCompleteScreen = pollingAct && storySegments.some(seg => seg.type === "act_complete");

    // The renderSegment function is now split, with the 'text' case handled 
    // directly in the map to manage the `textSegmentCounter` cleanly.
    const renderNonTextSegment = (segment: StorySegment, key: string) => {
        switch (segment.type) {
            case "decision":
                return (
                    <motion.div
                        key={key}
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="mb-4 font-bold" style={{ color: textColor }}>
                            {segment.question}
                        </p>
                        <div className="space-y-2">
                            {Array.from({ length: segment.options || 0 }).map((_, option) => (
                                <button
                                    key={option}
                                    onClick={() => onChoiceSelection(segment.id!, (option + 1).toString())}
                                    disabled={!!segment.user_choice}
                                    className={`w-full p-3 rounded-lg text-left transition-all ${segment.user_choice === (option + 1).toString()
                                        ? isDarkMode
                                            ? "bg-indigo-600 text-white"
                                            : "bg-indigo-500 text-white"
                                        : isDarkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    Option {option + 1}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );

            case "save":
                return (
                    <motion.div
                        key={key}
                        className={`mb-6 p-4 rounded-lg border-2 ${isDarkMode ? "border-yellow-500/50 bg-yellow-900/20" : "border-yellow-300 bg-yellow-50"}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className={`text-center font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                            Save this chapter?
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={onSaveStory}
                                className="flex-1 p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                            >
                                Save & Continue
                            </button>
                            <button
                                onClick={onSaveAndStop}
                                className="flex-1 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            >
                                Save & Stop
                            </button>
                            <button
                                onClick={onRevertStory}
                                className="flex-1 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                            >
                                Revert
                            </button>
                        </div>
                    </motion.div>
                );

            case "act_complete":
                return (
                    <motion.div
                        key={key}
                        className={`mb-6 p-6 rounded-xl shadow-lg text-center ${isDarkMode
                            ? "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50"
                            : "bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200"
                            }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className={`text-lg font-semibold ${isDarkMode ? "text-purple-200" : "text-purple-900"}`}>
                            Act {segment.current_act_id} Complete
                        </p>
                    </motion.div>
                );

            case "act_status":
                return (
                    <motion.div
                        key={key}
                        className={`mb-6 p-6 rounded-xl shadow-lg text-center ${isDarkMode
                            ? "bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50"
                            : "bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200"
                            }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <p className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-200" : "text-blue-900"}`}>
                            Act {segment.current_act_id} of {segment.total_acts}
                        </p>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Chapter {segment.latest_chapter_id} | Progress: {(segment.progress_percentage || 0).toFixed(1)}%
                        </p>
                    </motion.div>
                );

            case "act_transition": {
                const actNum = segment.current_act_id ?? "?";
                const totalActs = segment.total_acts ?? "?";

                return (
                    <ActInterludeScreen
                        key={key}
                        actNumber={actNum}
                        totalActs={totalActs}
                        isDarkMode={isDarkMode}
                        isActive={true}
                    />
                );
            }

            case "story_complete":
                return (
                    <motion.div
                        key={key}
                        className={`mb-6 p-6 rounded-xl shadow-lg text-center ${isDarkMode
                            ? "bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-700/50"
                            : "bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200"
                            }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                            The End
                        </h3>
                        <p className={`text-lg font-semibold ${isDarkMode ? "text-green-200" : "text-green-900"}`}>
                            Story Complete
                        </p>
                        <p className={`text-sm mt-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {segment.message || "Thank you for reading this tale to its final chapter."}
                        </p>
                    </motion.div>
                );
            default:
                return null;
        }
    };


    // Reset the text segment counter before starting the map
    let textSegmentCounter = -1;

    return (
        <div className="flex-1 min-w-0">
            <div className={`rounded-xl shadow-lg overflow-hidden transition-all ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-full max-h-[calc(100vh-150px)]"} ${isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"}`}>
                <div className={`sticky top-0 z-20 backdrop-blur-sm border-b flex items-center justify-between px-4 py-2 ${isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"}`}>
                    <div className="flex items-center space-x-4">
                        {currentActId > 0 && (
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isDarkMode ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
                                    Act {currentActId}
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {liveActTitle || currentActTitle}
                                </span>
                            </div>
                        )}
                        {statusMessage && (
                            <div className={`ml-auto text-xs font-medium animate-pulse ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                                {statusMessage}
                            </div>
                        )}
                    </div>

                    {isFullscreen && (
                        <span className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
                            {isLoadingStoryBox ? "Loading Story..." : storyMetadata.story_title}
                        </span>
                    )}

                    <div className="flex items-center space-x-2">
                        {!isFullscreen && (
                            <>
                                <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`} title="Text Settings">
                                    <Type size={20} />
                                </button>
                                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30" : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"}`} title={isDarkMode ? "Light Mode" : "Dark Mode"}>
                                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                                <button onClick={() => setIsFullscreen(true)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`} title="Fullscreen">
                                    <Maximize2 size={20} />
                                </button>
                            </>
                        )}
                        {isFullscreen && (
                            <button onClick={() => setIsFullscreen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}>
                                <Minimize2 size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {showSettings && !isFullscreen && (
                    <div className={`flex flex-wrap items-center gap-4 p-4 border-t animate-fade-in ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Font</label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className={`rounded-lg px-3 py-1.5 text-sm ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}
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
                                className={`rounded-lg px-3 py-1.5 text-sm ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}
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

                <div className={`overflow-y-auto p-6 sm:p-8 lg:p-12 ${isFullscreen ? "max-w-4xl mx-auto h-[calc(100vh-80px)]" : "h-[calc(100%-80px)]"}`}>
                    {statusMessage && !currentActId && <SubtleStatusMessage message={statusMessage} isDark={isDarkMode} />}

                    {isLoadingStoryBox ? (
                        <LoadingSkeleton isDark={isDarkMode} />
                    ) : isShowingActCompleteScreen ? (
                        <motion.div
                            className="max-w-2xl mx-auto text-center py-16 px-8 relative overflow-hidden"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                        >
                            {/* Magical background glow */}
                            <div className="absolute inset-0 opacity-30 pointer-events-none">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl animate-ping" />
                            </div>

                            <div className="relative z-10">
                                <motion.h3
                                    className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                    animate={{
                                        textShadow: [
                                            "0 0 20px rgba(168, 85, 247, 0.5)",
                                            "0 0 40px rgba(168, 85, 247, 0.8)",
                                            "0 0 20px rgba(168, 85, 247, 0.5)"
                                        ]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    Act {currentActId || "..."} Complete
                                </motion.h3>

                                <p className={`text-xl md:text-2xl mb-6 leading-relaxed font-medium ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
                                    The curtain falls softly. The lights dim to embers.
                                </p>

                                <p className={`text-lg md:text-xl italic max-w-2xl mx-auto mb-8 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                                    In the wings of imagination, scribes and muses are weaving the next act with starlight and wonder...
                                </p>

                                <p className={`text-sm opacity-80 ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>
                                    Great stories pause to breathe. Your patience is part of the magic. Thank you.
                                </p>

                                {/* Floating magical orbs */}
                                <div className="flex justify-center mt-12 gap-6">
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-purple-400 shadow-purple-400/80" : "bg-purple-500 shadow-purple-500/80"} shadow-2xl`}
                                            animate={{
                                                y: [0, -40, 0],
                                                opacity: [0.6, 1, 0.6],
                                            }}
                                            transition={{
                                                duration: 4 + i * 0.4,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : storySegments.length > 0 ? (
                        <>
                            {storySegments.map((segment, index) => {
                                const key = `${segment.id}-${index}`;

                                // === SCENE VIEW STATE LOGIC: Handle 'text' segments ===
                                if (segment.type === 'text') {
                                    textSegmentCounter++;
                                    const ref = sceneRefs[textSegmentCounter];
                                    const sceneId = textSegmentCounter; // 0-indexed scene ID

                                    return (
                                        <motion.div
                                            key={key}
                                            ref={ref}
                                            data-scene-id={sceneId}
                                            className="mb-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <StreamingText
                                                text={segment.scene_text || ""}
                                                fontSize={fontSize}
                                                fontFamily={fontFamily}
                                                textColor={textColor}
                                                onStreamComplete={onStreamComplete}
                                            />
                                        </motion.div>
                                    );
                                }
                                // === END SCENE VIEW STATE LOGIC ===

                                // Handle all other segment types
                                return renderNonTextSegment(segment, key);
                            })}
                            {isConnected && <LoadingSkeleton isDark={isDarkMode} />}
                            <div ref={storyEndRef} />
                        </>
                    ) : (
                        <p className={`italic text-center py-10 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                            {currentChapter < totalChapters
                                ? `Viewing Chapter ${currentChapter}. Select the latest chapter to continue.`
                                : isStoryComplete
                                    ? "The story has concluded."
                                    : 'Click "Continue Story" to begin.'}
                        </p>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {showRatingPrompt && (
                    <StoryRatingPrompt
                        onRate={(rating) => {
                            setHasRated(true);
                            if (props.onRateStory) {
                                props.onRateStory(rating);
                            }
                            setShowRatingPrompt(false);
                        }}
                        onDismiss={() => {
                            setHasDismissedRating(true);
                            setShowRatingPrompt(false);
                        }}
                        onClose={() => setShowRatingPrompt(false)}
                        isDarkMode={isDarkMode}
                    />
                )}
            </AnimatePresence>
            <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
        @keyframes fade-in-out { 0% { opacity: 0; transform: scale(0.8); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; } 100% { opacity: 0; transform: scale(0.8); } }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-fade-in-out { animation: fade-in-out 4s ease-in-out; }
        .animate-blink { animation: blink 1s infinite; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${isDarkMode ? "#1F2937" : "#F3F4F6"}; }
        ::-webkit-scrollbar-thumb { background: ${isDarkMode ? "#4F46E5" : "#4338CA"}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? "#6366F1" : "#312E81"}; }
      `}</style>
        </div>
    );
}

function StoryRatingPrompt({
    onRate,
    onDismiss,
    onClose,
    isDarkMode,
}: {
    onRate: (rating: number) => void;
    onDismiss: () => void;
    onClose: () => void;
    isDarkMode: boolean;
}) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    const handleClick = (rating: number) => {
        setSelected(rating);
        onRate(rating);
    };

    const handleClose = () => {
        if (selected === 0) {
            onDismiss();
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={handleClose}
        >
            <motion.div
                className={`relative max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl border ${isDarkMode
                    ? "bg-gray-800/95 border-gray-700"
                    : "bg-white/95 border-gray-200"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 text-2xl font-light rounded-full w-10 h-10 flex items-center justify-center transition-all ${isDarkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-200 text-gray-500"
                        }`}
                >
                    ×
                </button>

                <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                        How was your story?
                    </h3>
                    <p className={`text-sm mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                        {selected > 0
                            ? "Thank you for your feedback!"
                            : "Your rating helps us improve the magic ✨"}
                    </p>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-3 mb-10">
                        {stars.map((star) => {
                            const isFilled = star <= (hovered || selected);
                            return (
                                <motion.button
                                    key={star}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => handleClick(star)}
                                    className="focus:outline-none transition-all"
                                    aria-label={`Rate ${star} stars`}
                                >
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill={isFilled ? "#FBBF24" : "none"}
                                        stroke={isFilled ? "#F59E0B" : (isDarkMode ? "#4B5563" : "#9CA3AF")}
                                        strokeWidth="2"
                                        className="drop-shadow-lg"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Final Button */}
                    <button
                        onClick={handleClose}
                        className={`w-full py-4 rounded-2xl font-semibold text-white transition-all shadow-xl ${selected > 0
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            }`}
                    >
                        {selected > 0 ? "Thank you!" : "No thanks, maybe later"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
function ActInterludeScreen({
    actNumber,
    totalActs,
    isDarkMode,
    isActive,
}: {
    actNumber: number | string;
    totalActs: number | string;
    isDarkMode: boolean;
    isActive: boolean;
}) {
    const messages = [
        "The stagehands of fate are moving scenery behind the curtain…",
        "Ink and starlight are being carefully mixed for the next scene…",
        "Ancient tomes are being consulted. The muses demand perfection…",
        "A thousand possibilities are being woven into one golden thread…",
        "The gods of narrative are rolling their dice once-in-a-millennium dice…",
        "Memories of the last act are crystallising into legend…",
        "Somewhere, a quill scratches furiously. The next line is almost ready…",
        "Even the silence between acts has its own secret melody…",
    ];

    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex(i => (i + 1) % messages.length);
        }, 8500);
        return () => clearInterval(messageInterval);
    }, []);

    useEffect(() => {
        if (!isActive) {
            setProgress(100);
            return;
        }

        setProgress(0);
        const duration = 120000;
        const increment = 100 / (duration / 1000);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + increment;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`mb-6 p-6 rounded-xl shadow-lg text-center ${isDarkMode
                ? "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/50"
                : "bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200"
                }`}
        >
            <p className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-200" : "text-purple-900"}`}>
                Act {actNumber} of {totalActs}
            </p>

            <div className="min-h-[2rem] flex items-center justify-center mb-4">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8 }}
                        className={`text-sm italic ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}
                    >
                        {messages[messageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {isActive && (
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-xs mb-1 opacity-70">
                        <span>Preparing the next act</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden bg-white/20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
