"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type Slide = { image: string; title: string; subtitle: string };
const slides: Slide[] = [
  { image: "/wizard-tower.jpg", title: "Turn Ideas Into Worlds", subtitle: "Turn sparks of imagination into full worlds." },
  { image: "/forest-bg.jpg", title: "Choose Your Own Path", subtitle: "Every choice leads to a new adventure." },
  { image: "/starry-night-bg.jpg", title: "Stories for All Ages", subtitle: "Stories for dreamers of all ages." },
];

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

type ColorRipple = {
  id: number;
  x: number;
  y: number;
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [colorRipples, setColorRipples] = useState<ColorRipple[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const particleCounter = useRef(0);
  const rippleCounter = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const colors = [
    "rgba(108,92,231,0.8)", // Purple
    "rgba(255,118,117,0.8)", // Coral
    "rgba(255,209,102,0.8)", // Yellow
    "rgba(0,191,166,0.8)", // Teal
    "rgba(255,107,237,0.8)", // Pink
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create color ripples like navbar
    const rippleId = Date.now() + rippleCounter.current++;
    setColorRipples((prev) => [...prev, { id: rippleId, x, y }]);

    setTimeout(() => {
      setColorRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1500); // Match duration

    // Create magical particles
    if (Math.random() > 0.7) {
      const uniqueId = Date.now() + particleCounter.current++;
      const newParticle: Particle = {
        id: uniqueId,
        x,
        y,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 2 + 1,
        delay: 0,
      };
      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== uniqueId));
      }, (newParticle.duration + newParticle.delay) * 1000);
    }
  };

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center text-center"
      style={{ position: "relative", zIndex: 0 }}
    >
      {/* Carousel */}
      <motion.div className="flex h-full w-full" animate={{ x: `-${index * 100}%` }} transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
            style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="bg-black/40 absolute inset-0" />
            <div className="relative z-10 px-6">
              <h1 className="text-[66px] font-bold mb-4 text-white" style={{ fontFamily: "var(--font-fredoka)" }}>
                {slide.title}
              </h1>
              <p className="text-[32px] font-medium text-white" style={{ fontFamily: "var(--font-nunito)" }}>
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Color ripple effects layer */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
        {/* Color gradient ripples */}
        <AnimatePresence>
          {colorRipples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ opacity: 0.4, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: 120,
                height: 120,
                left: ripple.x - 60,
                top: ripple.y - 60,
                background:
                  "radial-gradient(circle, rgba(108,92,231,0.4) 0%, rgba(0,191,166,0.4) 40%, transparent 70%)",
                pointerEvents: "none",
                mixBlendMode: "overlay",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Magical floating particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
                y: -100,
                x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                borderRadius: Math.random() > 0.5 ? "50%" : "30%",
                background: particle.color,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}