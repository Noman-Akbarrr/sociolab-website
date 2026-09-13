"use client";

import { useRef, useState, useEffect, useCallback } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function HeroReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollHeight = el.offsetHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const raw = -rect.top / scrollHeight;
      setProgress(Math.min(1, Math.max(0, raw)));
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  const p = easeOutCubic(progress);

  // Panel translate: 0 → 105% (fully off screen)
  const panelTranslate = p * 105;
  // Image scale: 1.2 → 1.0
  const imageScale = 1.2 - p * 0.2;
  // Duotone opacity: 0 → 0.5
  const duotoneOpacity = p * 0.5;
  // Wordmark: visible at start, fades out as panels move
  const wordmarkOpacity = Math.max(0, 1 - p * 3);
  // Wordmark gap: 0 → 6vw as it splits
  const wordmarkGap = p * 6;
  // Dots: fade out with wordmark
  const dotsOpacity = Math.max(0, 1 - p * 3);
  // Metadata fade out with panels
  const metaOpacity = Math.max(0, 1 - p * 2.5);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "250vh" }}
    >
      {/* ── Sticky Stage ──────────────────────────────── */}
      <div
        className="sticky top-0 flex h-screen w-full overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        {/* ── Layer 1: Full-bleed image ────────────────── */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-reveal.jpeg"
            alt=""
            className="h-full w-full object-cover object-center"
            style={{
              transform: `scale(${imageScale})`,
              willChange: "transform",
            }}
          />
        </div>

        {/* ── Layer 2: Duotone wash ────────────────────── */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,85,0,0.7) 0%, rgba(20,184,166,0.6) 50%, rgba(255,107,26,0.5) 100%)",
            mixBlendMode: "overlay",
            opacity: duotoneOpacity,
          }}
        />

        {/* ── Layer 3: Radial vignette ─────────────────── */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(9,13,22,0.4) 50%, rgba(9,13,22,0.85) 100%)",
          }}
        />

        {/* ── Layer 4: Left panel ──────────────────────── */}
        <div
          className="absolute top-0 left-0 z-[3] flex h-full items-stretch"
          style={{
            width: "50.5%",
            backgroundColor: "#090D16",
            transform: `translateX(-${panelTranslate}%)`,
            willChange: "transform",
          }}
        >
          <div
            className="absolute top-6 left-6 sm:top-8 sm:left-8"
            style={{ opacity: metaOpacity }}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Est. 2024
            </span>
          </div>
          <div
            className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8"
            style={{ opacity: metaOpacity }}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Pakistan
            </span>
          </div>
        </div>

        {/* ── Layer 4: Right panel ─────────────────────── */}
        <div
          className="absolute top-0 right-0 z-[3] flex h-full items-stretch"
          style={{
            width: "50.5%",
            backgroundColor: "#090D16",
            transform: `translateX(${panelTranslate}%)`,
            willChange: "transform",
          }}
        >
          <div
            className="absolute top-6 right-6 sm:top-8 sm:right-8"
            style={{ opacity: metaOpacity }}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Growth Studio
            </span>
          </div>
          <div
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8"
            style={{ opacity: metaOpacity }}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
              30°N 71°E
            </span>
          </div>
        </div>

        {/* ── Layer 5: Accent dots at center seam ──────── */}
        <div
          className="absolute top-1/2 left-1/2 z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center gap-3"
          style={{ opacity: dotsOpacity, pointerEvents: "none" }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{
              backgroundColor: "#FF5500",
              boxShadow: "0 0 12px 4px rgba(255,85,0,0.6), 0 0 30px 8px rgba(255,85,0,0.3)",
            }}
          />
          <span
            className="block h-2 w-2 rounded-full"
            style={{
              backgroundColor: "#14b8a6",
              boxShadow: "0 0 12px 4px rgba(20,184,166,0.6), 0 0 30px 8px rgba(20,184,166,0.3)",
            }}
          />
        </div>

        {/* ── Layer 6: Wordmark — SOCIOLAB splits on scroll ── */}
        <div
          className="absolute top-1/2 left-1/2 z-[6] flex -translate-x-1/2 -translate-y-1/2 items-center"
          style={{
            gap: `${wordmarkGap}vw`,
            opacity: wordmarkOpacity,
            pointerEvents: "none",
            willChange: "gap, opacity",
          }}
        >
          <span
            className="font-display text-[clamp(3rem,10vw,8rem)] font-extrabold tracking-[-0.04em] leading-none"
            style={{
              color: "#FF5500",
              textShadow: "0 0 40px rgba(255,85,0,0.4), 0 0 80px rgba(255,85,0,0.2)",
            }}
          >
            SOCI
          </span>
          <span
            className="font-display text-[clamp(3rem,10vw,8rem)] font-extrabold tracking-[-0.04em] leading-none"
            style={{
              color: "#FFFFFF",
              textShadow: "0 0 40px rgba(255,255,255,0.15)",
            }}
          >
            OLAB
          </span>
        </div>

        {/* ── Scroll indicator ─────────────────────────── */}
        <div
          className="absolute bottom-8 left-1/2 z-[7] -translate-x-1/2"
          style={{ opacity: Math.max(0, 1 - p * 3), pointerEvents: "none" }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Scroll
            </span>
            <div className="h-8 w-[1px] animate-pulse bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
