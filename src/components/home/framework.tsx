"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stages = [
  {
    num: "01",
    title: "Discovery & Strategy",
    summary: "We analyze your current online presence, competitors, and target audience to build a custom growth plan.",
    bullets: ["Competitor & Audience Research", "Current Presence Audit", "Custom Growth Strategy"],
  },
  {
    num: "02",
    title: "Creative & Content",
    summary: "We design and create all the assets you need — from ad creatives to social media content to your website.",
    bullets: ["Ad Creatives & Copywriting", "Social Media Content Calendar", "Website & Landing Page Design"],
  },
  {
    num: "03",
    title: "Launch & Campaigns",
    summary: "Everything goes live — ad campaigns, social media content, and your website. We monitor daily.",
    bullets: ["Meta & Google Ads Launch", "Social Media Goes Live", "Website Deployment"],
  },
  {
    num: "04",
    title: "Optimize & Scale",
    summary: "Weekly reporting, A/B testing, and scaling what works — we keep improving every month.",
    bullets: ["Weekly Performance Reports", "A/B Testing & Optimization", "Scaling Winning Campaigns"],
  },
];

export function Framework() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(".fw-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // Horizontal scroll pins the section and moves cards left
      const track = trackRef.current;
      if (track) {
        const cards = track.querySelectorAll(".fw-card");
        const totalScroll = track.scrollWidth - window.innerWidth + 100;

        gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Each card fades in as it enters viewport
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0.3, scale: 0.92 },
            {
              opacity: 1, scale: 1, duration: 0.3,
              scrollTrigger: {
                trigger: card,
                containerAnimation: gsap.getById?.("fw-scroll") || undefined,
                start: "left 80%",
                end: "left 40%",
                scrub: true,
              },
            }
          );
        });
      }

      // Decorative line draw
      const line = sectionRef.current?.querySelector(".fw-line") as SVGLineElement;
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#1C1917" }}>
      {/* Background decorative line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line className="fw-line" x1="0" y1="50%" x2="100%" y2="50%" stroke="#FF5500" strokeWidth="0.5" opacity="0.1" />
      </svg>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="fw-title text-3xl md:text-4xl font-bold text-center mb-4 opacity-0" style={{ color: "#FFFFFF" }}>
            How We Work
          </h2>
          <p className="fw-title text-center max-w-2xl mx-auto text-base opacity-0" style={{ color: "#A8A29E" }}>
            A simple, proven process that gets results — no complicated frameworks, no jargon.
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-6 px-6 md:px-12 will-change-transform" style={{ width: "max-content" }}>
          {stages.map((stage) => (
            <div
              key={stage.num}
              className="fw-card w-[340px] md:w-[400px] shrink-0 p-8 rounded-xl flex flex-col justify-between"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C" }}
            >
              <div>
                <span className="font-mono text-5xl font-extrabold" style={{ color: "#FF5500", opacity: 0.2 }}>
                  {stage.num}
                </span>
                <h3 className="text-xl font-bold mt-4 mb-3" style={{ color: "#FFFFFF" }}>
                  {stage.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A29E" }}>
                  {stage.summary}
                </p>
              </div>
              <ul className="space-y-2">
                {stage.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs" style={{ color: "#D6D3D1" }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
