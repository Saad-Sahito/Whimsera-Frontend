"use client";

import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function HowItWorks() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Reset flipped cards when section goes out of view
  useEffect(() => {
    if (!isInView) {
      setFlippedCards([]);
    }
  }, [isInView]);

  const steps = [
    {
      title: "Choose Your Seed",
      description:
        "Pick a title, setting, and hero to spark your adventure. Let your imagination bloom like a magical seed ready to grow into a wondrous world.",
      image: "/scroll1.png",
      gradient: "linear-gradient(135deg, rgba(255,118,117,0.85), rgba(255,209,102,0.85))",
      stepColor: "#FF7675",
      shadowColor: "rgba(255,118,117,0.6)",
    },
    {
      title: "Watch AI Spin the Tale",
      description:
        "Our AI transforms your spark of creativity into an immersive, interactive story. Watch as the narrative unfolds with twists, turns, and adventure!",
      image: "/crystal-ball1.png",
      gradient: "linear-gradient(135deg, rgba(0,191,166,0.85), rgba(116,192,252,0.85))",
      stepColor: "#00BFA6",
      shadowColor: "rgba(0,191,166,0.6)",
    },
    {
      title: "Interact and Explore",
      description:
        "Dive into your storyworld! Make choices, discover hidden paths, or share your magical story with friends and fellow dreamers.",
      image: "/telescope1.png",
      gradient: "linear-gradient(135deg, rgba(108,92,231,0.85), rgba(255,209,102,0.85))",
      stepColor: "#6C5CE7",
      shadowColor: "rgba(108,92,231,0.6)",
    },
  ];

  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    top: number;
    left: number;
    size: number;
    color: string;
    delay: number;
  }>>([]);

  const [floatingOrbs, setFloatingOrbs] = useState<Array<{
    id: number;
    top: number;
    left: number;
    size: number;
    color: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Sparkles
    setSparkles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        color: ["#FFD166", "#74C0FC", "#FF7675", "#6C5CE7", "#FFFFFF"][Math.floor(Math.random() * 5)],
        delay: Math.random() * 3,
      }))
    );

    // Floating orbs
    setFloatingOrbs(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 40 + 60,
        color: ["rgba(255,209,102,0.15)", "rgba(116,192,252,0.15)", "rgba(108,92,231,0.15)"][Math.floor(Math.random() * 3)],
        duration: Math.random() * 10 + 15,
      }))
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-16 pb-24 overflow-hidden">
      {/* Magical background layers */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(108,92,231,0.2), transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating orbs */}
        {floatingOrbs.map((orb) => (
          <motion.div
            key={`orb-${orb.id}`}
            className="absolute rounded-full blur-2xl"
            style={{
              top: `${orb.top}%`,
              left: `${orb.left}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              backgroundColor: orb.color,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 30, -30, 0],
              scale: [1, 1.3, 0.9, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Enhanced sparkles with star effect */}
        {sparkles.map((s) => {
          const yAnim = [-15 + Math.random() * -10, 10 + Math.random() * 10, -15 + Math.random() * -10];
          const xAnim = [-10 + Math.random() * -5, 10 + Math.random() * 5, -10 + Math.random() * -5];
          const opacityAnim = [0.2, 1, 0.2];
          const scaleAnim = [0.3, 1.2, 0.3];

          return (
            <motion.div
              key={s.id}
              className="absolute"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size * 8}px`,
                height: `${s.size * 8}px`,
                pointerEvents: "none",
              }}
              animate={{
                y: yAnim,
                x: xAnim,
                scale: scaleAnim,
                opacity: opacityAnim,
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                repeatType: "mirror",
                delay: s.delay,
                ease: "easeInOut",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle, ${s.color} 0%, transparent 70%)`,
                  filter: "blur(1px)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  backgroundColor: s.color,
                  filter: "blur(0.5px)",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-6 text-center relative">
        {/* Magical header with glow effect */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2
            className="text-6xl font-bold mb-6 text-[#6C5CE7] relative inline-block"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            How It Works ✨
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
              style={{
                background: "linear-gradient(90deg, #FF7675, #FFD166, #74C0FC, #6C5CE7)",
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </h2>
          <motion.p
            className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-poppins)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Embark on a journey where imagination meets technology
          </motion.p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-start gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative w-full md:w-1/3"
              style={{
                perspective: "1500px",
              }}
            >
              <motion.div
                className="relative w-full cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  minHeight: "500px",
                }}
                initial={{ opacity: 0, y: 120, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.3, 
                  ease: "easeOut",
                }}
                animate={{
                  rotateY: flippedCards.includes(index) ? 180 : 0,
                }}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                }}
                onClick={() => toggleFlip(index)}
              >
                {/* FRONT FACE */}
                <motion.div
                  className="absolute inset-0 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] group"
                  style={{
                    background: step.gradient,
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    boxShadow: flippedCards.includes(index) 
                      ? "0 20px 60px rgba(0,0,0,0.15)"
                      : "0 20px 60px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Magical border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, transparent, ${step.shadowColor}, transparent)`,
                      filter: "blur(20px)",
                      transform: "translateZ(-10px)",
                    }}
                  />

                  {/* Floating particles around card */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`particle-${index}-${i}`}
                      className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        backgroundColor: step.stepColor,
                        top: `${20 + i * 15}%`,
                        left: i % 2 === 0 ? "-10px" : "calc(100% + 10px)",
                      }}
                      animate={{
                        y: [0, -20, 0],
                        x: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  {/* Step number with magical effect */}
                  <motion.div
                    className="text-4xl font-extrabold mb-6 relative z-10"
                    style={{
                      fontFamily: "var(--font-fredoka)",
                      color: step.stepColor,
                      WebkitTextStroke: "1px rgba(45,52,54,0.5)",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    }}
                    animate={{
                      textShadow: [
                        "2px 2px 4px rgba(0,0,0,0.4)",
                        `2px 2px 20px ${step.shadowColor}`,
                        "2px 2px 4px rgba(0,0,0,0.4)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Step {index + 1}
                  </motion.div>

                  {/* Enhanced glow behind image */}
                  <motion.div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-40 blur-3xl"
                    style={{ background: step.gradient }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Image with hover animation */}
                  <motion.div 
                    className="flex justify-center mb-6 relative z-10"
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-28 h-28 z-10 drop-shadow-2xl">
                      <Image
                        src={step.image}
                        alt={`${step.title} icon`}
                        fill
                        sizes="112px"
                        className="object-contain"
                      />
                    </div>
                    {/* Rotating ring around image */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-50"
                      style={{ borderColor: step.stepColor }}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      }}
                    />
                  </motion.div>

                  {/* Step text with enhanced styling */}
                  <h4
                    className="text-3xl font-bold mb-4 text-white drop-shadow-lg"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {step.title}
                  </h4>

                  {/* Click to flip hint */}
                  <p
                    className="text-sm text-white/80 italic mt-4"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Click to reveal details ✨
                  </p>

                  {/* Magical shine effect on hover */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                      }}
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* BACK FACE */}
                <motion.div
                  className="absolute inset-0 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col justify-center items-center"
                  style={{
                    background: step.gradient,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Magical border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-70"
                    style={{
                      background: `linear-gradient(135deg, transparent, ${step.shadowColor}, transparent)`,
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Step number on back */}
                  <motion.div
                    className="text-3xl font-extrabold mb-6 relative z-10"
                    style={{
                      fontFamily: "var(--font-fredoka)",
                      color: step.stepColor,
                      WebkitTextStroke: "1px rgba(45,52,54,0.5)",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    }}
                  >
                    Step {index + 1}
                  </motion.div>

                  {/* Title on back */}
                  <h4
                    className="text-3xl font-bold mb-6 text-white drop-shadow-lg text-center"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p
                    className="text-lg leading-relaxed text-white/95 drop-shadow-md text-center relative z-10 px-4"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {step.description}
                  </p>

                  {/* Click to flip back hint */}
                  <p
                    className="text-sm text-white/80 italic mt-6"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Click to flip back
                  </p>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Enhanced wavy connector with animation */}
        <motion.svg
          className="absolute left-0 right-0 top-full pointer-events-none"
          width="100%"
          height="140"
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.path
            d="M0 90 C360 0, 1080 140, 1440 50 V140 H0 V90 Z"
            fill="rgba(255, 209, 102, 0.2)"
            animate={{
              d: [
                "M0 90 C360 0, 1080 140, 1440 50 V140 H0 V90 Z",
                "M0 70 C360 120, 1080 20, 1440 70 V140 H0 V70 Z",
                "M0 90 C360 0, 1080 140, 1440 50 V140 H0 V90 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      </div>
    </section>
  );
}