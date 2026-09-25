"use client";

import { useEffect, useRef } from "react";
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

      // Phase cards stagger from bottom
      gsap.fromTo(".onb-card",
        { opacity: 0, y: 60, rotateX: -10 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
        }
      );

      // Trust banner slides up
      gsap.fromTo(".onb-trust",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".onb-trust", start: "top 90%" }
        }
      );

      // Decorative line
      const line = sectionRef.current?.querySelector(".onb-line") as SVGLineElement;
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#1C1917" }}>
      {/* Decorative horizontal line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line className="onb-line" x1="0" y1="50%" x2="100%" y2="50%" stroke="#FF5500" strokeWidth="0.5" opacity="0.08" />
      </svg>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative">
        <h2 className="onb-title text-3xl md:text-4xl font-bold mb-6 opacity-0" style={{ color: "#FFFFFF" }}>
          Your First 30 Days
        </h2>
        <p className="onb-title max-w-xl text-base mb-12 opacity-0" style={{ color: "#A8A29E" }}>
          From kickoff to results in 4 weeks. Here&apos;s exactly what happens:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.period}
              className="onb-card opacity-0 p-6 rounded-xl"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C", perspective: "600px" }}
            >
              <span className="text-xs font-mono tracking-wider" style={{ color: "#FF5500" }}>
                {phase.period}
              </span>
              <h3 className="text-sm font-semibold mt-2 mb-3" style={{ color: "#FFFFFF" }}>
                {phase.title}: {phase.summary}
              </h3>
              <ul className="space-y-2">
                {phase.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs" style={{ color: "#D6D3D1" }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
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
