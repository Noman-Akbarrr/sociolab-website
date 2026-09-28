"use client";

import { useMemo } from "react";

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

const VIEW_W = 1440;
const VIEW_H = 900;

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

// Curved path: left → up → down through center → up → right
const ORIGINAL_SEGMENTS: Cubic[] = [
  // Segment 1: Enter from left, curve up
  {
    p0: { x: -100, y: VIEW_H * 0.55 },
    p1: { x: VIEW_W * 0.15, y: VIEW_H * 0.25 },
    p2: { x: VIEW_W * 0.35, y: VIEW_H * 0.7 },
    p3: { x: VIEW_W * 0.45, y: VIEW_H * 0.45 },
  },
  // Segment 2: Curve down through center
  {
    p0: { x: VIEW_W * 0.45, y: VIEW_H * 0.45 },
    p1: { x: VIEW_W * 0.55, y: VIEW_H * 0.2 },
    p2: { x: VIEW_W * 0.75, y: VIEW_H * 0.8 },
    p3: { x: VIEW_W * 0.85, y: VIEW_H * 0.4 },
  },
  // Segment 3: Curve up and exit right
  {
    p0: { x: VIEW_W * 0.85, y: VIEW_H * 0.4 },
    p1: { x: VIEW_W * 0.9, y: VIEW_H * 0.15 },
    p2: { x: VIEW_W * 1.05, y: VIEW_H * 0.85 },
    p3: { x: VIEW_W + 100, y: VIEW_H * 0.5 },
  },
];

const SPLITS_PER_SEGMENT = 4;

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
  speed = 30, 
  fontSize = 13, 
  textOpacity = 0.04, 
  textColor = "#1C1917",
}: { 
  speed?: number; 
  fontSize?: number; 
  textOpacity?: number; 
  textColor?: string;
}) {
  const d = useMemo(() => toPathD(DEFAULT_PATH), []);
  const fullText = MARKETING_PHRASES.join("");

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10" 
      aria-hidden="true"
      style={{ 
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="fixed inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          id="wispr-curve"
          fill="transparent"
          stroke="transparent"
          d={d}
        />

        <text style={{ fontSize, fontFamily: '"Space Grotesk", monospace', fontWeight: 500 }}>
          <textPath
            id="wispr-text-path"
            href="#wispr-curve"
            startOffset="0%"
            className="font-normal"
            style={{ fill: textColor, opacity: textOpacity, baselineShift: "-35%" }}
          >
            {fullText}{fullText}{fullText}{fullText}
            <animate
              attributeName="startOffset"
              dur={`${speed}s`}
              values="100%;-300%"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}