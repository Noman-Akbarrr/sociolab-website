"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const MARKETING_PHRASES = [
  "Performance Marketing that scales  •  ",
  "Meta Ads · Google Ads · TikTok Ads  •  ",
  "ROAS optimization · CAPI · DCT  •  ",
  "Creative testing matrices that convert  •  ",
  "WhatsApp Business API funnels  •  ",
  "Social Media Management & Growth  •  ",
  "Content strategy · Reels · Shorts  •  ",
  "Community management · UGC campaigns  •  ",
  "Influencer seeding · Creator partnerships  •  ",
  "Web Development that converts  •  ",
  "Landing pages · Funnels · E-commerce  •  ",
  "Speed optimization · Core Web Vitals  •  ",
  "Conversion-focused design systems  •  ",
  "Analytics & Attribution done right  •  ",
  "GA4 · Server-side tracking · UTMs  •  ",
  "Weekly dashboards · Real insights  •  ",
  "No lock-in contracts · Results in 30 days  •  ",
  "50+ brands scaled across Pakistan  •  ",
  "Digital Marketing Agency Lahore  •  ",
  "Growth partners · Not vendors  •  ",
];

const VIEW_W = 1200;
const VIEW_H = 800;

type Point = { x: number; y: number };
type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point };
type Segment = { c1: Point; c2: Point; end: Point };
type PathState = { start: Point; segments: Segment[] };

const round = (n: number) => Math.round(n * 1000) / 1000;
const rp = (p: Point): Point => ({ x: round(p.x), y: round(p.y) });
const lerp = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const ORIGINAL_SEGMENTS: Cubic[] = [
  {
    p0: { x: -100, y: VIEW_H * 0.5 },
    p1: { x: VIEW_W * 0.2, y: VIEW_H * 0.1 },
    p2: { x: VIEW_W * 0.4, y: VIEW_H * 0.8 },
    p3: { x: VIEW_W * 0.5, y: VIEW_H * 0.5 },
  },
  {
    p0: { x: VIEW_W * 0.5, y: VIEW_H * 0.5 },
    p1: { x: VIEW_W * 0.6, y: VIEW_H * 0.2 },
    p2: { x: VIEW_W * 0.8, y: VIEW_H * 0.8 },
    p3: { x: VIEW_W * 0.9, y: VIEW_H * 0.4 },
  },
  {
    p0: { x: VIEW_W * 0.9, y: VIEW_H * 0.4 },
    p1: { x: VIEW_W * 1.0, y: VIEW_H * 0.1 },
    p2: { x: VIEW_W * 1.1, y: VIEW_H * 0.9 },
    p3: { x: VIEW_W + 100, y: VIEW_H * 0.5 },
  },
];

const SPLITS_PER_SEGMENT = 3;

function splitCubic(b: Cubic, t: number): { left: Cubic; right: Cubic } {
  const a1 = lerp(b.p0, b.p1, t);
  const a2 = lerp(b.p1, b.p2, t);
  const a3 = lerp(b.p2, b.p3, t);
  const b1 = lerp(a1, a2, t);
  const b2 = lerp(a2, a3, t);
  const mid = lerp(b1, b2, t);
  return {
    left: { p0: b.p0, p1: a1, p2: b1, p3: mid },
    right: { p0: mid, p1: b2, p2: a3, p3: b.p3 },
  };
}

function subCubic(b: Cubic, t0: number, t1: number): Cubic {
  const right = splitCubic(b, t0).right;
  const t = (t1 - t0) / (1 - t0);
  return splitCubic(right, t).left;
}

const DEFAULT_PATH: PathState = {
  start: rp(ORIGINAL_SEGMENTS[0].p0),
  segments: ORIGINAL_SEGMENTS.flatMap((cubic) => {
    const segs: Segment[] = [];
    for (let i = 0; i < SPLITS_PER_SEGMENT; i++) {
      const sub = subCubic(
        cubic,
        i / SPLITS_PER_SEGMENT,
        (i + 1) / SPLITS_PER_SEGMENT,
      );
      segs.push({ c1: rp(sub.p1), c2: rp(sub.p2), end: rp(sub.p3) });
    }
    return segs;
  }),
};

function toPathD({ start, segments }: PathState): string {
  let d = `M${round(start.x)} ${round(start.y)}`;
  for (const s of segments) {
    d += `C${round(s.c1.x)} ${round(s.c1.y)} ${round(s.c2.x)} ${round(s.c2.y)} ${round(s.end.x)} ${round(s.end.y)}`;
  }
  return d;
}

export function WisprFlow({ 
  speed = 25, 
  fontSize = 14, 
  textOpacity = 0.06, 
  textColor = "#1C1917",
  strokeColor = "transparent"
}: { 
  speed?: number; 
  fontSize?: number; 
  textOpacity?: number; 
  textColor?: string;
  strokeColor?: string;
}) {
  const [path] = useState<PathState>(DEFAULT_PATH);
  
  const d = useMemo(() => toPathD(path), [path]);

  const fullText = MARKETING_PHRASES.join("");

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          id="wispr-curve"
          fill="transparent"
          stroke={strokeColor}
          d={d}
        />

        <text style={{ fontSize, fontFamily: '"Space Grotesk", monospace', fontWeight: 500 }}>
          <textPath
            id="wispr-text-path"
            href="#wispr-curve"
            startOffset="0%"
            className="font-normal"
            style={{ fill: textColor, opacity: textOpacity, baselineShift: "-30%" }}
          >
            {fullText}{fullText}{fullText}
            <animate
              attributeName="startOffset"
              dur={`${65 - speed}s`}
              values="100%;-200%"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}