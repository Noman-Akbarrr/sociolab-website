"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function LogoStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const logos = track.querySelectorAll(".logo-item");
    const totalWidth = track.scrollWidth / 2;

    gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    return () => { gsap.killTweensOf(track); };
  }, []);

  const logos = [
    "Exact Fashion", "Sehgal Motors", "Tanzeem", "GCC Startups",
    "Local Brands", "E-Commerce Stores",
  ];

  return (
    <section className="py-10 overflow-hidden" style={{ borderTop: "1px solid #E7E5E4", borderBottom: "1px solid #E7E5E4" }}>
      <p className="text-center text-xs font-mono uppercase tracking-widest mb-8" style={{ color: "#A8A29E" }}>
        Trusted by brands across Pakistan and beyond
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #FAFAF9, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #FAFAF9, transparent)" }} />

        <div ref={trackRef} className="flex items-center gap-16 whitespace-nowrap will-change-transform">
          {[...logos, ...logos, ...logos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="logo-item text-lg font-semibold cursor-default shrink-0 transition-colors duration-300"
              style={{ color: "#D6D3D1" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D6D3D1")}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
