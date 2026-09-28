"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "░▒▓█▄▀▌▐▀▄█▓▒░";
const ROWS = 12;
const COLS = 40;

export function FluidFooterBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => CHARS[Math.floor(Math.random() * CHARS.length)])
    )
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const animate = () => {
      if (!ctx) return;
      
      frame++;
      
      ctx.fillStyle = "#070A10";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 14;
      const cols = Math.floor(canvas.width / (fontSize * 0.6));
      const rows = Math.floor(canvas.height / fontSize);

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const noise = Math.sin(frame * 0.02 + x * 0.5 + y * 0.3) * 0.5 + 
                        Math.cos(frame * 0.015 + x * 0.3 - y * 0.4) * 0.5;
          
          const intensity = (noise + 1) / 2;
          const charIndex = Math.floor(intensity * (CHARS.length - 1));
          const char = CHARS[charIndex];

          const alpha = 0.05 + intensity * 0.15;
          ctx.fillStyle = `rgba(255, 85, 0, ${alpha})`;
          
          ctx.fillText(
            char,
            x * fontSize * 0.6,
            y * fontSize
          );
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}