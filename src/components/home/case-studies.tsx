"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FocusCards } from "@/components/ui/focus-cards";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const caseStudies = [
  {
    slug: "exact-fashion-store",
    client: "Exact Fashion Store",
    industry: "E-Commerce",
    metric: "314",
    metricLabel: "WhatsApp Chats",
    cost: "PKR 22.79",
    summary: "Dynamic creative testing matrix for Independence Day collection driving 314 high-intent buyer conversations.",
    tags: ["Meta Ads", "CAPI", "WhatsApp"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    metrics: [
      { label: "Chats", value: "314" },
      { label: "CPL", value: "PKR 22.79" },
    ],
  },
  {
    slug: "sehgal-motors",
    client: "Sehgal Motors",
    industry: "Automotive",
    metric: "3.8x",
    metricLabel: "ROAS Achieved",
    cost: "PKR 180",
    summary: "Full-funnel Meta Ads architecture for Pakistan's leading automotive retailer on PKR 50K daily budget.",
    tags: ["Meta Ads", "Retargeting", "Leads"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
    metrics: [
      { label: "ROAS", value: "3.8x" },
      { label: "Daily Budget", value: "PKR 50K" },
    ],
  },
  {
    slug: "gcc-startups",
    client: "GCC Startups",
    industry: "B2B Consultancy",
    metric: "47%",
    metricLabel: "Lower CPL",
    cost: "PKR 2.4M",
    summary: "Rebuilt lead generation engine for GCC-based startup consultancy, reducing cost per lead by 47%.",
    tags: ["Google Ads", "Meta", "WhatsApp Bot"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    metrics: [
      { label: "CPL Reduction", value: "47%" },
      { label: "Total Spend", value: "PKR 2.4M" },
    ],
  },
  {
    slug: "k-skincarelab",
    client: "K-SkincareLab",
    industry: "Beauty & Skincare",
    metric: "3.2x",
    metricLabel: "ROAS in 60 Days",
    cost: "PKR 2.1M",
    summary: "Built a high-converting skincare brand from scratch using UGC-first creative strategy and TikTok Shop integration.",
    tags: ["Meta Ads", "TikTok Ads", "UGC", "Influencer"],
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
    metrics: [
      { label: "ROAS", value: "3.2x" },
      { label: "Timeframe", value: "60 Days" },
    ],
  },
];

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cs-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      gsap.fromTo(".fc-grid",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      // Decorative line
      const line = sectionRef.current?.querySelector(".cs-line") as SVGLineElement;
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
    <section ref={sectionRef} id="case-studies" className="py-24 md:py-32 relative">
      {/* Decorative line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line className="cs-line" x1="80%" y1="0" x2="20%" y2="100%" stroke="#FF5500" strokeWidth="0.5" opacity="0.06" />
      </svg>

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative">
        <div className="flex items-end justify-between mb-12">
          <h2 className="cs-title text-3xl md:text-4xl font-bold opacity-0" style={{ color: "#1C1917" }}>
            Results That Speak
          </h2>
          <Link href="/case-studies" className="cs-title text-sm font-semibold opacity-0 transition-colors hover:text-[#FF5500]" style={{ color: "#78716C" }}>
            View all →
          </Link>
        </div>

        <FocusCards 
          cards={caseStudies.map(cs => ({
            title: cs.client,
            src: cs.image,
            description: cs.summary,
            metrics: cs.metrics,
          }))}
          className="fc-grid"
          columns={4}
        />
      </div>
    </section>
  );
}