// components/RippleWrapper.tsx - NEW REUSABLE COMPONENT
// Duplicate the navbar ripple effect everywhere!
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

export default function RippleWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let rippleCounter = 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const vw = window.innerWidth * 0.05;
    const rippleSize = Math.min(Math.max(30, vw), 50);

    const uniqueId = Date.now() + rippleCounter++;
    setRipples((prev) => [...prev, { id: uniqueId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== uniqueId));
    }, 1000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Ripple layer */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {ripples.map((r) => {
            const vw = window.innerWidth * 0.05;
            const rippleSize = Math.min(Math.max(30, vw), 50);
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0.5, scale: 0.6 }}
                animate={{ opacity: 0, scale: 2.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: `${rippleSize}px`,
                  height: `${rippleSize}px`,
                  left: `${r.x - rippleSize / 2}px`,
                  top: `${r.y - rippleSize / 2}px`,
                  background:
                    "radial-gradient(circle, rgba(255,209,102,0.4) 0%, rgba(116,192,252,0.3) 70%, transparent 100%)",
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
      {children}
    </div>
  );
}