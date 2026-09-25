"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

// Scattered positions: top-left, mid-right, bottom-left, mid-right-lower
const positions = [
  { top: "8%", left: "5%" },
  { top: "28%", right: "5%" },
  { top: "52%", left: "8%" },
  { top: "72%", right: "8%" },
];

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title
      gsap.fromTo(".cap-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // Each card pins and reveals as you scroll to it
      const cards = gsap.utils.toArray<HTMLElement>(".service-card");
      cards.forEach((card, i) => {
        // Entry animation
        gsap.fromTo(card,
          { opacity: 0, y: 80, scale: 0.85, rotateZ: i % 2 === 0 ? -3 : 3 },
          {
            opacity: 1, y: 0, scale: 1, rotateZ: 0,
            duration: 0.8, ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 40%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Pin each card in place while its content is visible
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          pin: false,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Background differentiation — subtle texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "#F5F5F4" }}>
        {/* Scattered decorative dots */}
        <div className="absolute top-[15%] left-[12%] w-2 h-2 rounded-full bg-[#FF5500] opacity-10" />
        <div className="absolute top-[35%] right-[15%] w-3 h-3 rounded-full bg-[#FF5500] opacity-[0.07]" />
        <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#FF5500] opacity-15" />
        <div className="absolute top-[80%] right-[25%] w-2.5 h-2.5 rounded-full bg-[#FF5500] opacity-[0.05]" />
        <div className="absolute top-[45%] left-[60%] w-1 h-1 rounded-full bg-[#1C1917] opacity-[0.06]" />
        <div className="absolute top-[20%] right-[40%] w-2 h-2 rounded-full bg-[#1C1917] opacity-[0.04]" />

        {/* Subtle diagonal lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#1C1917" strokeWidth="0.5" />
          <line x1="20%" y1="0" x2="100%" y2="80%" stroke="#1C1917" strokeWidth="0.5" />
          <line x1="0" y1="20%" x2="80%" y2="100%" stroke="#1C1917" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="py-24 md:py-32 max-w-[1240px] mx-auto px-6 md:px-12 relative">
        <div className="text-center mb-20">
          <h2 className="cap-title text-3xl md:text-4xl font-bold text-center mb-4 opacity-0" style={{ color: "#1C1917" }}>
            Four Services. One Growth Engine.
          </h2>
          <p className="cap-title text-center max-w-xl mx-auto text-sm opacity-0" style={{ color: "#78716C" }}>
            Hover to explore each service
          </p>
        </div>

        {/* Scattered card layout — tall section for scroll space */}
        <div className="relative" style={{ minHeight: "160vh" }}>
          {pillars.map((pillar, i) => {
            const pos = positions[i];

          return (
              <div
                key={pillar.title}
                className="service-card"
                style={{
                  position: "sticky",
                  top: `${12 + i * 18}%`,
                  zIndex: i + 1,
                  left: "left" in pos ? pos.left : undefined,
                  right: "right" in pos ? pos.right : undefined,
                  width: "min(380px, 85vw)",
                }}
              >
                <div
                  className="group p-6 rounded-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #E7E5E4",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Number */}
                  <span className="font-mono text-xs font-bold" style={{ color: "#FF5500" }}>
                    0{i + 1}
                  </span>

                  {/* Title — always visible */}
                  <h3 className="text-xl font-bold mt-2 mb-0 group-hover:mb-3 transition-all duration-300" style={{ color: "#1C1917" }}>
                    {pillar.title}
                  </h3>

                  {/* Content — reveals on hover */}
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

                  {/* Hover hint */}
                  <div className="mt-2 group-hover:opacity-0 transition-opacity duration-300">
                    <span className="text-[10px] font-mono" style={{ color: "#A8A29E" }}>hover to explore →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
