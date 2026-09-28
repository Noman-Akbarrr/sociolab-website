"use client";

import { useEffect, useRef, useState } from "react";

const MARKETING_PHRASES = [
  "Performance Marketing that scales",
  "Meta Ads · Google Ads · TikTok Ads",
  "ROAS optimization · CAPI · DCT",
  "Creative testing matrices that convert",
  "WhatsApp Business API funnels",
  "Social Media Management & Growth",
  "Content strategy · Reels · Shorts",
  "Community management · UGC campaigns",
  "Influencer seeding · Creator partnerships",
  "Web Development that converts",
  "Landing pages · Funnels · E-commerce",
  "Speed optimization · Core Web Vitals",
  "Conversion-focused design systems",
  "Analytics & Attribution done right",
  "GA4 · Server-side tracking · UTMs",
  "Weekly dashboards · Real insights",
  "No lock-in contracts · Results in 30 days",
  "50+ brands scaled across Pakistan",
  "Digital Marketing Agency Lahore",
  "Growth partners · Not vendors",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function WisprFlow({ 
  speed = 30, 
  fontSize = 14, 
  opacity = 0.08, 
  color = "#1C1917",
  rows = 3 
}: { 
  speed?: number; 
  fontSize?: number; 
  opacity?: number; 
  color?: string;
  rows?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tracks, setTracks] = useState<string[][]>([]);

  useEffect(() => {
    const generateTracks = () => {
      const newTracks: string[][] = [];
      for (let r = 0; r < rows; r++) {
        const phrases = shuffleArray(MARKETING_PHRASES);
        const track = [...phrases, ...phrases, ...phrases];
        newTracks.push(track);
      }
      setTracks(newTracks);
    };
    generateTracks();
  }, [rows]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tracksElements = container.querySelectorAll(".wispr-track");
    tracksElements.forEach((trackEl, rowIndex) => {
      const htmlEl = trackEl as HTMLElement;
      const textElements = htmlEl.querySelectorAll(".wispr-text");
      if (textElements.length === 0) return;

      const firstText = textElements[0] as HTMLElement;
      const textWidth = firstText.offsetWidth;
      const containerWidth = container.offsetWidth;
      const totalWidth = textWidth * textElements.length;
      
      const duration = (totalWidth / containerWidth) * speed;
      
      htmlEl.style.animation = `wispr-flow ${duration}s linear infinite`;
      if (rowIndex % 2 === 1) {
        htmlEl.style.animationDirection = "reverse";
      }
    });

    return () => {
      tracksElements.forEach((trackEl) => {
        (trackEl as HTMLElement).style.animation = "";
      });
    };
  }, [tracks, speed, rows]);

  if (tracks.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <style jsx global>{`
        @keyframes wispr-flow {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .wispr-track {
          display: flex;
          white-space: nowrap;
          will-change: transform;
        }
        .wispr-text {
          font-family: "Space Grotesk", monospace;
          font-weight: 500;
          color: ${color};
          opacity: ${opacity};
          padding: 0 2rem;
        }
      `}</style>
      {tracks.map((track, rowIndex) => (
        <div
          key={rowIndex}
          className="wispr-track"
          style={{
            top: `${(100 / (rows + 1)) * (rowIndex + 1)}%`,
            left: "0",
            position: "absolute",
            transform: "translateY(-50%)",
          }}
          aria-hidden="true"
        >
          {track.map((phrase, i) => (
            <span key={`${rowIndex}-${i}`} className="wispr-text" style={{ fontSize }}>
              {phrase}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}