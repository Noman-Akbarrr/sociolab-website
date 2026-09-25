"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const phases = [
  {
    period: "Week 1",
    title: "Discovery & Setup",
    summary: "Audit your current presence and set up everything needed to grow.",
    bullets: ["Competitor & audience research", "Ad account setup & tracking", "Content strategy creation"],
  },
  {
    period: "Week 2",
    title: "Create & Build",
    summary: "Design and build all assets — from ad creatives to your website.",
    bullets: ["Ad creatives & copywriting", "Content calendar finalization", "Website or landing page build"],
  },
  {
    period: "Week 3-4",
    title: "Launch & Optimize",
    summary: "Everything goes live and we start optimizing based on real data.",
    bullets: ["Campaign launch & monitoring", "First content published", "Performance report & optimization"],
  },
];

function TimelineNode({ phase, index }: { phase: typeof phases[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="timeline-node relative flex items-start gap-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left: dot + line */}
      <div className="flex flex-col items-center shrink-0" style={{ width: "40px" }}>
        {/* Dot */}
        <div
          className="relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: "#FF5500",
            backgroundColor: hovered ? "#FF5500" : "#1C1917",
            boxShadow: hovered ? "0 0 20px rgba(255,85,0,0.4)" : "none",
          }}
        />
        {/* Connecting line */}
        {index < phases.length - 1 && (
          <div className="timeline-line w-[1px] h-32 transition-colors duration-300" style={{ backgroundColor: hovered ? "#FF5500" : "#44403C" }} />
        )}
      </div>

      {/* Right: content */}
      <div className="pt-[-2px] pb-12">
        {/* Period label */}
        <span className="font-mono text-xs tracking-wider transition-colors duration-300" style={{ color: hovered ? "#FF5500" : "#A8A29E" }}>
          {phase.period}
        </span>

        {/* Title — always visible */}
        <h3
          className="text-lg font-bold mt-1 transition-colors duration-300"
          style={{ color: hovered ? "#FF5500" : "#FFFFFF" }}
        >
          {phase.title}
        </h3>

        {/* Expanded content — pops up on hover */}
        <div
          className="overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: hovered ? "200px" : "0",
            opacity: hovered ? 1 : 0,
            marginTop: hovered ? "12px" : "0",
          }}
        >
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#A8A29E" }}>
            {phase.summary}
          </p>
          <ul className="space-y-2">
            {phase.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: "#D6D3D1" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hover hint when collapsed */}
        <div
          className="transition-all duration-300"
          style={{
            maxHeight: hovered ? "0" : "20px",
            opacity: hovered ? 0 : 0.5,
            overflow: "hidden",
          }}
        >
          <span className="text-[10px] font-mono" style={{ color: "#78716C" }}>hover to expand →</span>
        </div>
      </div>
    </div>
  );
}

export function Onboarding() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(".onb-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // Timeline nodes stagger in
      gsap.fromTo(".timeline-node",
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
        }
      );

      // Trust banner
      gsap.fromTo(".onb-trust",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".onb-trust", start: "top 90%" }
        }
      );

      // Animate the connecting line drawing
      const line = sectionRef.current?.querySelector(".onb-vert-line") as SVGLineElement;
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#1C1917" }}>
      {/* Background decorative vertical line */}
      <svg className="absolute left-[60px] top-0 h-full pointer-events-none hidden md:block" width="1" preserveAspectRatio="none">
        <line className="onb-vert-line" x1="0.5" y1="0" x2="0.5" y2="100%" stroke="#FF5500" strokeWidth="0.5" opacity="0.1" />
      </svg>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative">
        <div className="mb-16">
          <h2 className="onb-title text-3xl md:text-4xl font-bold mb-6 opacity-0" style={{ color: "#FFFFFF" }}>
            Your First 30 Days
          </h2>
          <p className="onb-title max-w-xl text-base opacity-0" style={{ color: "#A8A29E" }}>
            From kickoff to results in 4 weeks. Here&apos;s exactly what happens:
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-lg">
          {phases.map((phase, i) => (
            <TimelineNode key={phase.period} phase={phase} index={i} />
          ))}
        </div>

        {/* Trust Banner */}
        <div className="onb-trust opacity-0 mt-8 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center text-xs gap-4" style={{ backgroundColor: "rgba(255,85,0,0.08)", border: "1px solid rgba(255,85,0,0.2)", color: "#D6D3D1" }}>
          <span>Dedicated account manager, weekly check-ins, and transparent reporting — every step of the way.</span>
          <span className="font-semibold whitespace-nowrap" style={{ color: "#FF5500" }}>Guaranteed Response Within 24 Hours</span>
        </div>
      </div>
    </section>
  );
}
