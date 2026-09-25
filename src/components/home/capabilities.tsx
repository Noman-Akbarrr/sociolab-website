"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const pillars = [
  {
    title: "Performance Marketing",
    description: "Data-driven Meta and Google ad campaigns engineered to acquire customers at a profitable cost.",
    bullets: ["Meta & Instagram Ads", "Google Search & Shopping", "Retargeting Campaigns", "Conversion Tracking (CAPI)"],
  },
  {
    title: "Social Media Management",
    description: "Strategic content creation, community management, and growth across platforms — turning followers into customers.",
    bullets: ["Content Strategy & Calendar", "Reels & Short-Form Video", "Community Management", "Analytics & Reporting"],
  },
  {
    title: "Web Development",
    description: "High-converting websites, landing pages, and e-commerce stores built to turn your traffic into paying customers.",
    bullets: ["Landing Pages & Funnels", "E-Commerce Websites", "Speed & SEO Optimization", "Conversion-Focused Design"],
  },
  {
    title: "Analytics & Tracking",
    description: "Crystal-clear attribution so you know exactly which campaigns drive revenue — no more guessing or wasting budget.",
    bullets: ["GA4 Event Setup", "Server-Side Tracking", "UTM Taxonomy & Reporting", "Weekly Performance Dashboards"],
  },
];

// Desktop scattered positions — tighter vertical spacing
const desktopPositions = [
  { top: "4%",  left: "12%" },
  { top: "24%", right: "8%" },
  { top: "46%", left: "22%" },
  { top: "66%", right: "15%" },
];

function MouseGlow({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const glowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={glowRef}
      className="absolute pointer-events-none hidden md:block"
      style={{
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,85,0,0.08) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
        transition: "left 0.3s ease-out, top 0.3s ease-out",
        zIndex: 0,
      }}
      onMouseMove={(e) => {
        if (!containerRef.current || !glowRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        glowRef.current.style.left = `${e.clientX - rect.left}px`;
        glowRef.current.style.top = `${e.clientY - rect.top}px`;
      }}
    />
  );
}

function HoverCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative p-6 rounded-2xl cursor-pointer overflow-hidden"
      style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        border: "1px solid #E7E5E4",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.04)",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(255,85,0,0.08)" }}
    >
      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(255,85,0,0.06), transparent 60%)",
        }}
      />

      <div className="relative z-10">
        <span className="font-mono text-xs font-bold" style={{ color: "#FF5500" }}>
          0{index + 1}
        </span>

        <h3 className="text-xl font-bold mt-2 mb-0 group-hover:mb-3 transition-all duration-300" style={{ color: "#1C1917" }}>
          {pillar.title}
        </h3>

        <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-60 group-hover:opacity-100 transition-all duration-500 ease-out">
          <p className="text-sm leading-relaxed mt-3 mb-4" style={{ color: "#57534E" }}>
            {pillar.description}
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {pillar.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: "#44403C" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-[10px] font-mono" style={{ color: "#A8A29E" }}>hover to explore →</span>
        </div>
      </div>

      {/* Accent border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: "1px solid rgba(255,85,0,0.3)" }}
      />
    </motion.div>
  );
}

function MobileCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  return (
    <motion.div
      className="p-5 rounded-xl"
      style={{ backgroundColor: "white", border: "1px solid #E7E5E4" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-mono text-xs font-bold" style={{ color: "#FF5500" }}>
        0{index + 1}
      </span>
      <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: "#1C1917" }}>
        {pillar.title}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#57534E" }}>
        {pillar.description}
      </p>
      <ul className="grid grid-cols-2 gap-2">
        {pillar.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
            <span className="text-xs" style={{ color: "#44403C" }}>{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Capabilities() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section className="relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "#F5F5F4" }}>
        <div className="absolute top-[15%] left-[12%] w-2 h-2 rounded-full bg-[#FF5500] opacity-10" />
        <div className="absolute top-[35%] right-[15%] w-3 h-3 rounded-full bg-[#FF5500] opacity-[0.07]" />
        <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#FF5500] opacity-15" />
        <div className="absolute top-[80%] right-[25%] w-2.5 h-2.5 rounded-full bg-[#FF5500] opacity-[0.05]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#1C1917" strokeWidth="0.5" />
          <line x1="20%" y1="0" x2="100%" y2="80%" stroke="#1C1917" strokeWidth="0.5" />
          <line x1="0" y1="20%" x2="80%" y2="100%" stroke="#1C1917" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="py-24 md:py-32 max-w-[1240px] mx-auto px-6 md:px-12 relative">
        {/* Title */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#1C1917" }}>
            Four Services. One Growth Engine.
          </h2>
          <p className="text-center max-w-xl mx-auto text-sm" style={{ color: "#78716C" }}>
            Hover to explore each service
          </p>
        </motion.div>

        {/* ── Desktop: scattered cards with mouse glow ── */}
        <div ref={containerRef} className="hidden md:block relative" style={{ minHeight: "140vh" }}>
          <MouseGlow containerRef={containerRef} />

          {pillars.map((pillar, i) => {
            const pos = desktopPositions[i];
            return (
              <div
                key={pillar.title}
                className="absolute"
                style={{
                  top: pos.top,
                  left: "left" in pos ? pos.left : undefined,
                  right: "right" in pos ? pos.right : undefined,
                  width: "min(360px, 40vw)",
                  zIndex: i + 1,
                }}
              >
                <HoverCard pillar={pillar} index={i} />
              </div>
            );
          })}
        </div>

        {/* ── Mobile: stacked cards ── */}
        <div className="md:hidden flex flex-col gap-4">
          {pillars.map((pillar, i) => (
            <MobileCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
