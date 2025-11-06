"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      title: "Choose Your Seed",
      description: "Pick a title, setting, and hero to spark your adventure.",
      image: "/scroll1.png",
      color: "#E64A19", // Vibrant orange-red
      glow: "rgba(230,74,25,0.5)",
    },
    {
      title: "Watch AI Spin the Tale",
      description: "Our AI transforms your idea into an immersive, interactive story.",
      image: "/crystal-ball1.png",
      color: "#00796B", // Deep teal
      glow: "rgba(0,121,107,0.5)",
    },
    {
      title: "Interact & Explore",
      description: "Make choices, discover hidden paths, and share your tale.",
      image: "/telescope1.png",
      color: "#5E35B1", // Rich purple
      glow: "rgba(94,53,177,0.5)",
    },
  ];

  return (
    <section className="relative pt-24 pb-32 overflow-visible -my-20">
      {/* Subtle animated accent orb (kept for depth, but optional) */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 70%, #FFD54F40, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          How It Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-700 max-w-2xl mx-auto mb-16"
        >
          Three simple steps to unleash your imagination.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg"
              whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            >
              {/* Glow on hover */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                style={{ background: `linear-gradient(135deg, ${step.glow}, transparent)` }}
              />

              {/* Step number */}
              <motion.div
                className="text-5xl font-extrabold mb-6"
                style={{
                  color: step.color,
                  textShadow: `0 0 20px ${step.glow}`,
                }}
                animate={{
                  textShadow: [
                    "0 0 10px transparent",
                    `0 0 30px ${step.glow}`,
                    "0 0 10px transparent",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {i + 1}
              </motion.div>

              {/* Image */}
              <motion.div
                className="relative w-32 h-32 mx-auto mb-6"
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.15 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-contain drop-shadow-xl"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ borderColor: step.color }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              {/* Title & description */}
              <h3
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wave to next section - solid color compatible */}
      {/* <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-32 md:h-40"
        >
          <path
            d="M0 70 Q360 120 720 70 T1440 70 V120 H0 V70Z"
            fill="#FFF8F1"
          />
        </svg>
      </div> */}
    </section>
  );
}