"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const IMAGES = [
  "/download.jpg",
  "/download-(2).jpeg",
  "/starry-night-bg1.jpg",
  "/bottom-CTA.jpg",
];

export default function FinalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [completedLayers, setCompletedLayers] = useState<number[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const isAutoCompletingRef = useRef(false);

  // Load images
  useEffect(() => {
    const loadPromises = IMAGES.map((src) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    });

    Promise.all(loadPromises).then(setImages);
  }, []);

  // Initialize all canvases when images load
  useEffect(() => {
    if (images.length === 0) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvasRefs.current.forEach((canvas, index) => {
        if (!canvas) return;
        canvas.width = w;
        canvas.height = h;
        
        const ctx = canvas.getContext("2d");
        if (ctx && images[index]) {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(images[index], 0, 0, w, h);
        }
      });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [images]);

  const autoCompleteErase = (canvas: HTMLCanvasElement, layerIndex: number) => {
    if (isAutoCompletingRef.current) return;
    isAutoCompletingRef.current = true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fade out the entire canvas
    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.05;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCompletedLayers(prev => [...prev, layerIndex]);
        isAutoCompletingRef.current = false;
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }, 16);
  };

  const handleMouseMove = (e: React.MouseEvent, layerIndex: number) => {
    // Don't erase if this layer is already completed or if it's the last image
    if (completedLayers.includes(layerIndex) || layerIndex === IMAGES.length - 1) return;
    if (isAutoCompletingRef.current) return;

    const canvas = canvasRefs.current[layerIndex];
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Erase with a larger gradient brush
    ctx.globalCompositeOperation = "destination-out";
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 120);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 120, 0, Math.PI * 2);
    ctx.fill();

    // Check reveal progress occasionally
    if (Math.random() > 0.85) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      let transparentPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 10) transparentPixels++;
      }
      
      const revealRatio = transparentPixels / (canvas.width * canvas.height);
      
      // Auto-complete at 80% revealed
      if (revealRatio > 0.8) {
        autoCompleteErase(canvas, layerIndex);
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: "#000" }}
    >
      {/* Stack all image layers */}
      {images.map((img, index) => (
        <canvas
          key={index}
          ref={el => { canvasRefs.current[index] = el; }}
          className="absolute inset-0 cursor-crosshair"
          style={{ 
            zIndex: images.length - index,
            pointerEvents: completedLayers.includes(index) ? 'none' : 'auto'
          }}
          onMouseMove={(e) => handleMouseMove(e, index)}
        />
      ))}

      {/* Overlay gradient for cinematic look */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ zIndex: images.length + 1 }} />

      {/* Text & Button */}
      <motion.div
        className="relative flex flex-col items-center justify-center space-y-8 pointer-events-none"
        style={{ zIndex: images.length + 2 }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1
          className="text-white text-4xl md:text-6xl lg:text-7xl font-light px-4"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Your Next Adventure is only a Click Away
        </h1>

        <button
          className="px-8 py-4 rounded-full bg-[#38B2AC] text-white text-lg font-semibold transition-all duration-300 hover:bg-[#FFCC33] hover:text-black pointer-events-auto"
            style={{ fontFamily: "var(--font-poppins)" }}
        >
          Begin Your Story
        </button>
      </motion.div>
    </section>
  );
}