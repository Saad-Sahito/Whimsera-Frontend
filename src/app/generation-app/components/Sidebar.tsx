// components/Sidebar.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  isDarkMode: boolean;
  isLoading: boolean;
  storyTitle: string;
  currentChapter: number;
  totalChapters: number;
  onChapterChange: (chapter: number) => void;
  newChapterAvailable: boolean;
  storyWordCount: number;
  chapterWordCount: number;
  autoSave: boolean;
  setAutoSave: (value: boolean) => void;
  onContinueStory: () => void;
  isConnected: boolean;
  isStoryComplete: boolean;
}

export default function Sidebar(props: SidebarProps) {
  const {
    isDarkMode,
    isLoading,
    storyTitle,
    currentChapter,
    totalChapters,
    onChapterChange,
    newChapterAvailable,
    storyWordCount,
    chapterWordCount,
    autoSave,
    setAutoSave,
    onContinueStory,
    isConnected,
    isStoryComplete,
  } = props;

  return (
    <div
      className={`rounded-2xl p-6 shadow-xl sticky top-24 transition-colors ${isDarkMode
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
        : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
        }`}
    >
      <h2
        className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {isLoading ? "Loading Story..." : storyTitle}
      </h2>
      <div className={`space-y-4 mb-6 pb-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
        <div className="flex justify-between items-center">
          <label htmlFor="chapter-select" className="font-semibold text-sm">Chapter:</label>
          <div className="relative">
            <select
              id="chapter-select"
              value={currentChapter}
              onChange={(e) => onChapterChange(Number(e.target.value))}
              disabled={isLoading || isConnected}
              className={`
                appearance-none 
                px-4 py-2 
                rounded-full 
                text-sm font-bold 
                w-28 text-center 
                border-2 
                transition-all 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 
                cursor-pointer
                ${isDarkMode
                  ? "bg-indigo-900/40 text-indigo-200 border-indigo-600 hover:bg-indigo-800/50"
                  : "bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200"
                }
              `}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}{num === totalChapters ? " (latest)" : ""}
                </option>
              ))}
            </select>
            {newChapterAvailable && currentChapter < totalChapters && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
        </div>
        {newChapterAvailable && currentChapter < totalChapters && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs text-center font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
          >
            New chapter available!
          </motion.p>
        )}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Story Word Count:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${isDarkMode ? "bg-teal-900/40 text-teal-300" : "bg-teal-100 text-teal-700"}`}>
            {storyWordCount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Chapter Word Count:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${isDarkMode ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
            {chapterWordCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold text-sm">Auto-Save</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
      <button
        onClick={onContinueStory}
        disabled={isConnected || currentChapter < totalChapters || isStoryComplete}
        className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg ${isConnected || currentChapter < totalChapters || isStoryComplete
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
}