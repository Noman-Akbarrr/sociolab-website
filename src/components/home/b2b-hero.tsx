"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function B2BHero() {
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

  // Phase A → B transition: wordmark fades out, image scales up
  const wordmarkOpacity = Math.max(0, 1 - p * 4);
  const promptOpacity = Math.max(0, 1 - p * 5);
  const imageScale = 0.85 + p * 0.15;
  const imageOpacity = Math.min(1, p * 3);
  const splitGap = Math.min(1, p * 2.5);

  // settled state: content fades in
  const contentOpacity = Math.min(1, Math.max(0, (p - 0.35) / 0.4));
  const contentTranslateY = Math.max(0, (1 - Math.min(1, Math.max(0, (p - 0.35) / 0.4))) * 24);

  return (
    <section ref={containerRef} className="relative" style={{ height: "220vh" }}>
      {/* Sticky Stage */}
      <div className="sticky top-0 flex h-screen w-full overflow-hidden" style={{ isolation: "isolate" }}>

        {/* Background */}
        <div className="absolute inset-0 z-0" style={{ backgroundColor: "#0B0D11" }} />

        {/* Phase A: Centered wordmark */}
        <div
          className="absolute inset-0 z-[5] flex flex-col items-center justify-center"
          style={{ opacity: wordmarkOpacity, pointerEvents: wordmarkOpacity < 0.01 ? "none" : "auto" }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6">
            SOCIOLAB
          </h1>
          <p className="text-sm text-slate-400 tracking-wide flex items-center gap-2">
            Scroll to explore revenue architecture
            <span className="inline-block animate-bounce">↓</span>
          </p>
        </div>

        {/* Phase B/C: 50/50 Split Layout */}
        <div className="absolute inset-0 z-[3] flex items-center">
          <div className="w-full max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left: Image */}
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                opacity: imageOpacity,
                transform: `scale(${imageScale})`,
                height: "560px",
                willChange: "transform, opacity",
              }}
            >
              <img
                src="/hero-reveal.jpeg"
                alt="Enterprise B2B Go-To-Market"
                className="h-full w-full object-cover object-center"
              />
              {/* Floating metric badge */}
              <div className="absolute bottom-6 left-6 max-w-xs bg-slate-950/80 backdrop-blur-md border border-white/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                    Client Telemetry
                  </span>
                </div>
                <p className="text-sm font-medium text-white mt-1">
                  +$14.2M Enterprise Pipeline Generated in 2026
                </p>
              </div>
            </div>

            {/* Right: Content */}
            <div
              className="flex flex-col justify-center pl-0 md:pl-4"
              style={{
                opacity: contentOpacity,
                transform: `translateY(${contentTranslateY}px)`,
                willChange: "transform, opacity",
              }}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-4">
                // Enterprise B2B Go-To-Market
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-6">
                Clarity in Complex Markets. We Engineer Predictable B2B Revenue Engines.
              </h2>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8">
                We unite positioning, demand generation, and sales architecture for companies with $20k to $250k ACVs. Turn pipeline confusion into measurable commercial momentum.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#diagnostic-form"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3.5 rounded-lg transition-all"
                >
                  Request GTM Diagnostic
                </a>
                <a
                  href="#case-studies"
                  className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-medium px-6 py-3.5 rounded-lg transition-all"
                >
                  View Case Studies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
