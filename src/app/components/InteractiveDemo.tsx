"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

const storyTree = {
  start: {
    text: "You find an ancient map in your grandmother's attic. Its edges are yellowed with age, and strange symbols glow faintly in the dim light.",
    choices: [
      { text: "Study the symbols carefully", next: "study" },
      { text: "Follow the map immediately", next: "follow" }
    ]
  },
  study: {
    text: "The symbols begin to shift and rearrange themselves, forming words: 'Only the patient shall find what's hidden.' A hidden compartment in the attic wall clicks open.",
    choices: [
      { text: "Investigate the compartment", next: "compartment" },
      { text: "Take the map and leave", next: "leave" }
    ]
  },
  follow: {
    text: "You rush out into the moonlit night, map in hand. The glowing symbols point toward the old forest at the edge of town. Something rustles in the shadows.",
    choices: [
      { text: "Enter the forest boldly", next: "forest_bold" },
      { text: "Wait and observe", next: "forest_wait" }
    ]
  },
  compartment: {
    text: "Inside the compartment, you discover a golden compass and a note: 'For the worthy seeker.' The compass needle spins wildly before pointing north.",
    choices: [
      { text: "Follow the compass", next: "end_compass" },
      { text: "Return to the map", next: "end_map" }
    ]
  },
  leave: {
    text: "As you descend the attic stairs, you hear a whisper: 'Haste makes waste...' But you're determined. Adventure awaits!",
    choices: [
      { text: "Continue your journey", next: "end_haste" },
      { text: "Return to study more", next: "study" }
    ]
  },
  forest_bold: {
    text: "You stride confidently into the forest. The trees seem to part for you, and a glowing path appears, leading deeper into the unknown.",
    choices: [
      { text: "Follow the glowing path", next: "end_glow" },
      { text: "Mark your trail carefully", next: "end_careful" }
    ]
  },
  forest_wait: {
    text: "Patience rewards you. A silver fox emerges from the shadows, its eyes knowing. It seems to want you to follow it.",
    choices: [
      { text: "Trust the fox", next: "end_fox" },
      { text: "Stay cautious", next: "end_cautious" }
    ]
  },
  end_compass: {
    text: "The compass leads you to a hidden grove where an ancient tree stands. Its roots form the shape of a door. Your grandmother's greatest secret awaits...",
    isEnd: true
  },
  end_map: {
    text: "You combine the compass and map, revealing a complete picture. 'X marks the spot' glows in golden light on your grandmother's property. The real adventure is just beginning...",
    isEnd: true
  },
  end_haste: {
    text: "Your speed takes you to the location on the map, but something feels incomplete. Perhaps patience would have revealed more...",
    isEnd: true
  },
  end_glow: {
    text: "The path leads you to a mystical clearing where fireflies dance in patterns that spell out ancient words of wisdom. You've found the forest's heart...",
    isEnd: true
  },
  end_careful: {
    text: "Your careful trail-marking pays off when you discover you've been walking in a sacred spiral pattern. The forest accepts you as one of its guardians...",
    isEnd: true
  },
  end_fox: {
    text: "The silver fox was your grandmother's familiar! It leads you to her secret sanctuary, where books of magic and wonder await your discovery...",
    isEnd: true
  },
  end_cautious: {
    text: "Your caution keeps you safe but costs you the chance to learn the fox's secrets. Still, you've gained respect for the unknown...",
    isEnd: true
  }
};

export default function InteractiveDemo() {
  const [currentNode, setCurrentNode] = useState("start");
  const [history, setHistory] = useState<string[]>(["start"]);
  const [choices, setChoices] = useState(0);

 const node = storyTree[currentNode as keyof typeof storyTree] as {
  text: string;
  choices?: { text: string; next: string }[];
  isEnd?: boolean;
};

  const handleChoice = (next: string) => {
    setCurrentNode(next);
    setHistory([...history, next]);
    setChoices(choices + 1);
  };

  const restart = () => {
    setCurrentNode("start");
    setHistory(["start"]);
    setChoices(0);
  };

  return (
    <section className="relative py-24 px-6 overflow-visible ">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-72 h-72 bg-[#6C5CE7]/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#00BFA6]/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border-2 border-[#6C5CE7]/30 mb-6 shadow-sm"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
            <span className="text-sm font-bold text-[#2D3436]">Try It Yourself</span>
          </motion.div>

          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Your Choices,
            <span className="block mt-2 bg-gradient-to-r from-[#FF7675] via-[#6C5CE7] to-[#00BFA6] bg-clip-text text-transparent text-5xl md:text-6xl">
              Your Story
            </span>
          </h2>

          <p className="text-lg text-[#2D3436]/75 max-w-2xl mx-auto font-medium" style={{ fontFamily: "var(--font-nunito)" }}>
            Every decision branches into new possibilities. Experience how your choices shape the narrative.
          </p>
        </motion.div>

        {/* Interactive Story Demo */}
        <div className="max-w-3xl mx-auto">
          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E5E5E5] shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD166]" />
              <span className="text-sm font-semibold text-[#2D3436]" style={{ fontFamily: "var(--font-poppins)" }}>
                Choices Made: {choices}
              </span>
            </div>
            
            <motion.button
              onClick={restart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#E5E5E5] hover:bg-[#6C5CE7] hover:text-white rounded-xl font-semibold text-sm transition-all"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </motion.button>
          </motion.div>

          {/* Story Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNode}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-[#E5E5E5] overflow-hidden"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C5CE7] via-[#00BFA6] to-[#FFD166]" />

              {/* Story Text */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <p 
                    className="text-xl md:text-2xl text-[#2D3436] leading-relaxed"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {node.text}
                  </p>
                </motion.div>
              </div>

              {/* Choices or End Message */}
              {node.isEnd ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center py-6"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFA6]/10 to-[#6C5CE7]/10 rounded-full border-2 border-[#00BFA6]/30 mb-4">
                    <Sparkles className="w-5 h-5 text-[#00BFA6]" />
                    <span className="font-bold text-[#2D3436]" style={{ fontFamily: "var(--font-fredoka)" }}>
                      The End... Or Is It?
                    </span>
                  </div>
                  <p className="text-[#2D3436]/60 text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
                    Every ending is a new beginning in Whimsera
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-[#2D3436]/60 mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
                    What do you do?
                  </p>
                  
                  {node.choices?.map((choice, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleChoice(choice.next)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full group relative p-5 bg-gradient-to-r from-[#FFF8F1] to-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#6C5CE7] transition-all duration-300 text-left shadow-sm hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className="font-semibold text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {choice.text}
                        </span>
                        <ArrowRight className="w-5 h-5 text-[#2D3436]/40 group-hover:text-[#6C5CE7] transition-colors" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-[#2D3436]/60 text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
              This is just a tiny glimpse. Real stories in Whimsera are <span className="font-bold text-[#6C5CE7]">infinitely deeper</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}