"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Content Strategy & Calendar",
    description:
      "A planned, consistent content strategy tailored to your brand voice and audience — no more random posting.",
    details: [
      "Monthly content calendars",
      "Brand voice development",
      "Hashtag research & strategy",
      "Competitor content analysis",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Reels & Short-Form Video",
    description:
      "Scroll-stopping Reels and short-form video content designed for engagement, reach, and conversions.",
    details: [
      "Reels production & editing",
      "Trend-jacking & trending audio",
      "Hook-first storytelling",
      "Multi-platform formatting",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "Community Management",
    description:
      "Active engagement with your audience — replies, DMs, comments — building real relationships and loyalty.",
    details: [
      "Comment & DM management",
      "Review response strategy",
      "Audience engagement campaigns",
      "User-generated content curation",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Analytics & Reporting",
    description:
      "Clear, jargon-free reports showing what&apos;s working, what&apos;s not, and what we&apos;re doing next.",
    details: [
      "Weekly performance reports",
      "Content reach & engagement tracking",
      "Follower growth analytics",
      "Monthly strategy reviews",
    ],
  },
];

const platforms = [
  { name: "Instagram", desc: "Reels, Stories, Posts, Carousels — full Instagram management." },
  { name: "Facebook", desc: "Page management, groups, ads integration, and community building." },
  { name: "TikTok", desc: "Trend-jacking, short-form video, and viral content strategies." },
];

export default function SocialMediaPage() {
  const platformsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (platformsRef.current) {
      const items = platformsRef.current.querySelectorAll(".platform-item");
      gsap.fromTo(items,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.5, stagger: 0.12,
          scrollTrigger: { trigger: platformsRef.current, start: "top 80%" }
        }
      );
    }
  }, []);

  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Social Media Management
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
              Social Media That{" "}
              <span className="text-[#FF5500]">Drives Results</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
              Strategic content creation, community management, and growth across
              Instagram, Facebook, and TikTok — turning followers into customers.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get Free Social Audit
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-7 py-4 text-[15px] font-semibold transition-all duration-200 hover:bg-stone-50"
                style={{ color: "#1C1917" }}
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── What We Do ─────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              What We Do
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Full-Service Social Media Management
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                className="flex flex-col gap-4 p-6 rounded-xl bg-white border border-stone-200"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74", color: "#FF5500" }}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#1C1917" }}>{service.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2 mt-auto pt-4" style={{ borderTop: "1px solid #E7E5E4" }}>
                  {service.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                      <span className="text-sm" style={{ color: "#44403C" }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Platforms ──────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Platforms We Manage
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Where Your Audience Lives
            </h2>
          </div>
        </Reveal>

        <div ref={platformsRef} className="grid gap-6 md:grid-cols-3">
          {platforms.map((p) => (
            <div key={p.name} className="platform-item flex flex-col items-center gap-4 p-8 rounded-xl bg-white border border-stone-200 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74" }}>
                <svg className="w-8 h-8" style={{ color: "#FF5500" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "#1C1917" }}>{p.name}</h3>
              <p className="text-sm" style={{ color: "#57534E" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E7E5E4" }}>
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Ready to Grow Your Social Media?
            </h2>
            <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "#57534E" }}>
              Get a free social media audit. We&apos;ll show you what&apos;s working,
              what&apos;s not, and how to grow.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get Free Social Audit
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
