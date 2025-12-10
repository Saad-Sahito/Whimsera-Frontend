// components/Navbar.tsx
"use client";

import { MessageCircle } from "lucide-react";

interface NavbarProps {
  isDarkMode: boolean;
}

export default function Navbar({ isDarkMode }: NavbarProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 shadow-md transition-colors duration-300 ${isDarkMode
        ? "bg-gray-800/80 border-b border-gray-700 backdrop-blur-sm"
        : "bg-white/80 border-b border-gray-200 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="/dashboard"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${isDarkMode
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
          >
            Back to Dashboard
          </a>

          <h1
            className={`absolute left-1/2 transform -translate-x-1/2 text-lg sm:text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            style={{
              fontFamily: "'Annie Use Your Telescope', cursive",
              fontSize: 28
            }}
          >
            Whimsera Theatre
          </h1>

          <div className="flex items-center space-x-2">
            <a
              href="/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all hover:scale-105 ${isDarkMode
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