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

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(".cap-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // Desktop: staggered reveal of scattered cards
      if (window.innerWidth >= 768) {
        const cards = gsap.utils.toArray<HTMLElement>(".service-card-desktop");
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 60, scale: 0.9 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.7, delay: i * 0.15, ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 50%",
              },
            }
          );
        });
      } else {
        // Mobile: simple cards from bottom
        const cards = gsap.utils.toArray<HTMLElement>(".service-card-mobile");
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0,
              duration: 0.6, delay: i * 0.1, ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
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
        <div className="text-center mb-20">
          <h2 className="cap-title text-3xl md:text-4xl font-bold text-center mb-4 opacity-0" style={{ color: "#1C1917" }}>
            Four Services. One Growth Engine.
          </h2>
          <p className="cap-title text-center max-w-xl mx-auto text-sm opacity-0" style={{ color: "#78716C" }}>
            Hover to explore each service
          </p>
        </div>

        {/* ── Desktop: scattered sticky cards ── */}
        <div className="hidden md:block relative" style={{ minHeight: "180vh" }}>
          {/* Card 1: Performance Marketing — left, shifted right */}
          <div
            className="service-card-desktop absolute"
            style={{ top: "5%", left: "12%", width: "min(360px, 40vw)", zIndex: 1 }}
          >
            <HoverCard pillar={pillars[0]} index={0} />
          </div>

          {/* Card 2: Social Media — right, shifted toward center */}
          <div
            className="service-card-desktop absolute"
            style={{ top: "28%", right: "8%", width: "min(360px, 40vw)", zIndex: 2 }}
          >
            <HoverCard pillar={pillars[1]} index={1} />
          </div>

          {/* Card 3: Web Development — left, lower, different offset */}
          <div
            className="service-card-desktop absolute"
            style={{ top: "52%", left: "22%", width: "min(360px, 40vw)", zIndex: 3 }}
          >
            <HoverCard pillar={pillars[2]} index={2} />
          </div>

          {/* Card 4: Analytics — right, lower */}
          <div
            className="service-card-desktop absolute"
            style={{ top: "75%", right: "15%", width: "min(360px, 40vw)", zIndex: 4 }}
          >
            <HoverCard pillar={pillars[3]} index={3} />
          </div>
        </div>

        {/* ── Mobile: simple stacked cards ── */}
        <div className="md:hidden flex flex-col gap-4">
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className="service-card-mobile">
              <MobileCard pillar={pillar} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HoverCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  return (
    <div
      className="group p-6 rounded-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer"
      style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        border: "1px solid #E7E5E4",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.04)",
      }}
    >
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
  );
}

function MobileCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        backgroundColor: "white",
        border: "1px solid #E7E5E4",
      }}
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
    </div>
  );
}
