"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const IMAGES = [
  "/Final_Sections_Backgrounds/Serene-lakeside.png",
  "/Final_Sections_Backgrounds/adventurers.png",
  "/Final_Sections_Backgrounds/starry-night-bg1.png",
  "/Final_Sections_Backgrounds/stormy-cliffside.png",
  "/Final_Sections_Backgrounds/wizard-tower.png",
  "/Final_Sections_Backgrounds/young-adventurer.png",
  "/Final_Sections_Backgrounds/bloody-hallway.png",
  "/Final_Sections_Backgrounds/castle-courtyard.png",
  "/Final_Sections_Backgrounds/cherry-blossom.png",
  "/Final_Sections_Backgrounds/magical-forest.png",
  "/Final_Sections_Backgrounds/Foggy-Victorian-street.png",
  "/Final_Sections_Backgrounds/starry-night-bg.png",
];

export default function FinalSection() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [completedLayers, setCompletedLayers] = useState<number[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const isAutoCompletingRef = useRef(false);

  // Load images
  useEffect(() => {
    const loadPromises = IMAGES.map((src) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
      })
    );

    Promise.all(loadPromises)
      .then(setImages)
      .catch((err) => {
        console.error(err);
        // Optional: fallback images
      });
  }, []);

  // Initialize canvasRefs array
  useEffect(() => {
    canvasRefs.current = Array(IMAGES.length).fill(null);
  }, []);

  // Draw base + scratch layers
  useEffect(() => {
    if (images.length === 0) return;

    const drawAll = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvasRefs.current.forEach((canvas, index) => {
        if (!canvas || !images[index]) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);

        // Draw base image (this is revealed)
        ctx.drawImage(images[index], 0, 0, w, h);

        // Draw scratchable top layer (only if not last)
        if (index < IMAGES.length - 1) {
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(images[index + 1], 0, 0, w, h);
        }
      });
    };

    drawAll();
    window.addEventListener("resize", drawAll);
    return () => window.removeEventListener("resize", drawAll);
  }, [images]);

  const autoCompleteErase = (canvas: HTMLCanvasElement, layerIndex: number) => {
    if (isAutoCompletingRef.current) return;
    isAutoCompletingRef.current = true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let opacity = 1;
    const interval = setInterval(() => {
      opacity -= 0.06;
      if (opacity <= 0) {
        clearInterval(interval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCompletedLayers((prev) => [...prev, layerIndex]);
        isAutoCompletingRef.current = false;
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }, 16);
  };

  const BRUSH_RADIUS = 250;   // ← tweak this

const handleMouseMove = (e: React.MouseEvent, layerIndex: number) => {
  if (completedLayers.includes(layerIndex) || isAutoCompletingRef.current) return;
  if (layerIndex === IMAGES.length - 1) return;

  const canvas = canvasRefs.current[layerIndex];
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = "destination-out";

  const drawCircle = (offsetX: number, offsetY: number) => {
    const grad = ctx.createRadialGradient(
      x + offsetX, y + offsetY, 0,
      x + offsetX, y + offsetY, BRUSH_RADIUS
    );
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x + offsetX, y + offsetY, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  };

  // 3 overlapping circles → feels massive
  drawCircle(-BRUSH_RADIUS * 0.3, -BRUSH_RADIUS * 0.3);
  drawCircle(0, 0);
  drawCircle(BRUSH_RADIUS * 0.3, BRUSH_RADIUS * 0.3);

  // ----- progress check (unchanged) -----
  if (Math.random() > 0.9) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 50) transparent++;
    if (transparent / (canvas.width * canvas.height) > 0.75) {
      autoCompleteErase(canvas, layerIndex);
    }
  }
};

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Loading state */}
      {images.length === 0 && (
        <div className="text-white text-2xl">Loading adventure...</div>
      )}

      {/* Canvases */}
      {images.map((_, index) => (
        <canvas
          key={index}
          ref={(el) => {
            canvasRefs.current[index] = el;
          }}
          className="absolute inset-0 cursor-crosshair"
          style={{
            zIndex: IMAGES.length - index,
            pointerEvents:
              completedLayers.includes(index) || index === IMAGES.length - 1
                ? "none"
                : "auto",
          }}
          onMouseMove={(e) => handleMouseMove(e, index)}
        />
      ))}

      <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ zIndex: IMAGES.length + 1 }} />

      <motion.div
        className="relative z-50 text-center space-y-8 pointer-events-none"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1
          className="text-white text-4xl md:text-6xl lg:text-7xl font-light px-4"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Your Next Adventure Coming Soon!
        </h1>
      </motion.div>
    </section>
  );
}