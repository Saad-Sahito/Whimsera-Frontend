"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function Footer() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let rippleCounter = 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const uniqueId = Date.now() + rippleCounter++;
    setRipples((prev) => [...prev, { id: uniqueId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== uniqueId));
    }, 1000);
  };

  return (
    <footer
      onMouseMove={handleMouseMove}
      className="relative w-full text-white py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(45deg, rgba(108,92,231,0.8) 0%, rgba(0,191,166,0.8) 100%)",
      }}
    >
      {/* Ripple effect layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0.5, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: 50,
                height: 50,
                left: r.x - 20,
                top: r.y - 20,
                background:
                  "radial-gradient(circle, rgba(255,118,117,0.4) 0%, rgba(255,209,102,0.3) 70%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Left side — social icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center gap-6 relative z-10"
      >
        <button className="hover:scale-110 transition-transform">
          <Image
            src="/Icons8/icons8-facebook-50.png"
            alt="Facebook"
            width={28}
            height={28}
          />
        </button>
        <button className="hover:scale-110 transition-transform">
          <Image
            src="/Icons8/icons8-instagram-50.png"
            alt="Instagram"
            width={28}
            height={28}
          />
        </button>
        <button className="hover:scale-110 transition-transform">
          <Image
            src="/Icons8/icons8-x-50.png"
            alt="X"
            width={28}
            height={28}
          />
        </button>
      </motion.div>

      {/* Right side — navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex items-center gap-6 relative z-10"
      >
        {/* ✅ Use Next.js Link for About page */}
        <Link
          href="/about"
          className="text-white text-[18px] font-poppins font-semibold border-b-2 border-transparent hover:border-[#FFD166] transition"
        >
          About
        </Link>

        <button className="bg-[#FFD166] text-[#2D3436] px-5 py-2 rounded-md font-poppins font-bold text-[18px] hover:bg-[#FF7675] hover:text-white transition">
          Feedback
        </button>
      </motion.div>

      {/* Bottom center — copyright */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-white/80 font-nunito">
        © {new Date().getFullYear()} Whimsera. All rights reserved.
      </div>
    </footer>
  );
}
