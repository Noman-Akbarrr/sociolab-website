"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  },
  {
    slug: "tanzeem",
    client: "Tanzeem",
    industry: "Fashion & E-Commerce",
    metric: "2.7x",
    metricLabel: "ROAS in 30 Days",
    cost: "PKR 1.8M",
    summary: "First-ever paid acquisition funnel achieving 2.7x ROAS within 30 days through structured creative testing.",
    tags: ["Meta Ads", "DCT", "E-Commerce"],
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

      // Compact cards stagger in with clip-path reveal
      const cards = gsap.utils.toArray<HTMLElement>(".cs-compact");
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, delay: i * 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
          }
        );
      });

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {caseStudies.map((cs) => (
            <Link key={cs.slug} href={`/case-studies/${cs.slug}`}>
              <div className="cs-compact opacity-0 group p-5 rounded-xl border border-stone-200 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-1 hover:border-[#FF5500]/30 cursor-pointer">
                {/* Industry tag */}
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: "#FF5500" }}>
                  {cs.industry}
                </span>

                {/* Client name */}
                <h3 className="text-base font-bold mt-2 mb-1 transition-colors group-hover:text-[#FF5500]" style={{ color: "#1C1917" }}>
                  {cs.client}
                </h3>

                {/* Metric */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-extrabold font-mono" style={{ color: "#1C1917" }}>{cs.metric}</span>
                  <span className="text-xs" style={{ color: "#78716C" }}>{cs.metricLabel}</span>
                </div>

                {/* Summary */}
                <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "#78716C" }}>
                  {cs.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cs.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F5F5F4", color: "#57534E" }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read more arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#FF5500] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read case study
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
