"use client";
import React from "react";
import { MessageSquare, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface FeedbackPanelProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  feedback: string | null;
  loading?: boolean; // Already exists, now actively used
}

export const FeedbackPanel = ({ isOpen, setIsOpen, feedback, loading }: FeedbackPanelProps) => {
  const safeFeedback = typeof feedback === 'string' ? feedback : "";
  return (
    <>
      <div className={`bg-white border-l border-[#E5E5E5] shadow-2xl transition-all duration-300 flex flex-col ${isOpen ? 'w-96' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center bg-gray-50 h-16">
          <h3 className="font-bold flex items-center gap-2 text-[#2D3436]">
            <MessageSquare size={18} className="text-[#6C5CE7]" /> Director's Feedback
          </h3>
          <button onClick={() => setIsOpen(false)}>
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-40 text-[#6C5CE7]">
                <Loader2 className="animate-spin mb-2" />
                <p className="text-xs text-gray-400">Loading notes...</p>
             </div>
          ) : feedback ? (
             <div className="prose prose-sm prose-purple max-w-none text-[#2D3436] leading-relaxed">
                <ReactMarkdown>
                  {feedback}
                </ReactMarkdown>
             </div>
          ) : (
             <div className="text-center mt-20 text-gray-400">
                <MessageSquare size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Generate content and click Review to see feedback.</p>
             </div>
          )}
        </div>
      </div>

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-l-xl shadow-lg text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white transition-colors z-30"
        >
          <div className="relative">
            {loading && <Loader2 size={10} className="animate-spin absolute -top-1 -right-1" />}
            <MessageSquare size={20} />
          </div>
        </button>
      )}
    </>
  );
};