"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollBackgroundProps {
  children: React.ReactNode;
}

export default function ScrollBackground({ children }: ScrollBackgroundProps) {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define color stops for each section
  // Based on scroll position (0 = top, 1 = bottom)
  const backgroundColor = useTransform(
    scrollYProgress,
    // Input range - adjust these values based on your actual section positions
    [0, 0.12, 0.25, 0.37, 0.50, 0.62, 0.75, 0.87, 1],
    // Output colors - matching each section
    [
      "rgba(255, 248, 241, 0.3)",  // Hero - Seashell
      "rgba(0, 0, 0, 1)",  // Genre Showcase - Mint tint
      "rgba(255, 248, 241, 0.5)",  // Interactive Demo - Vanilla 
      "rgba(255, 248, 241, 0.6)",  // How It Works - Seashell (keep it consistent)
      "rgba(255, 248, 241, 0.7)",  // AI Magic - Seashell
      "rgba(255, 248, 241, 0.8)",  // Creative Freedom - Warm sunglow tint
      "rgba(255, 248, 241, 0.9)",  // Waitlist - Warm sunglow tint
      "rgba(255, 248, 241, 0.9)",  // Final Section - Dark (transition to black)
      "rgba(45, 52, 54, 1)"   // Final Section - Black
    ]
  );

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFF8F1]">{children}</div>;
  }

  return (
    <motion.div
      style={{ backgroundColor }}
      className="min-h-screen transition-colors duration-500"
    >
      {children}
    </motion.div>
  );
}