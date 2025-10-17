"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";

export default function SlideInSection({
  children,
  direction = "up", // "up" | "left" | "right"
}: {
  children: ReactNode;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView) setHasEntered(true);
  }, [isInView]);

  const offset = {
    up: { y: 50, x: 0 },
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={
        hasEntered
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset } // stay hidden until visible
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
