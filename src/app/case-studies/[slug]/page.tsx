"use client";

import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultsRef.current) {
      const items = resultsRef.current.querySelectorAll(".result-item");
      gsap.fromTo(items,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.5, stagger: 0.1,
          scrollTrigger: { trigger: resultsRef.current, start: "top 80%" }
        }
      );
    }
  }, []);

  // Use synchronous params access for client component
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  const cs = getCaseStudy(slug);

  if (!cs) return null;

  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm transition-colors mb-8"
            style={{ color: "#78716C" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M19 12H5m6-6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Case Studies
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-xs font-semibold text-[#FF5500]">{cs.industry}</span>
              <span className="font-mono text-xs font-semibold text-[#FF5500]">
                {cs.metric} {cs.metricLabel}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
              {cs.client}
            </h1>
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
              {cs.summary}
            </p>
          </div>
        </Reveal>
      </Container>

      {/* ── Challenge & Baseline ────────────────────── */}
      <Section>
        <Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
                The Challenge
              </p>
              <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
                {cs.challenge}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
                Starting Baseline
              </p>
              <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
                {cs.baseline}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── Strategy ────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Strategy
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              The Approach
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2 md:gap-0">
          {cs.strategy.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex items-start gap-4 py-8 md:px-8 md:py-0 border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0" style={{ borderColor: "#E7E5E4" }}>
                <span className="font-mono text-sm font-bold text-[#FF5500] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Creatives ───────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Creatives
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Ad Creatives Used
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {cs.creatives.map((c, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-5">
                <span className="size-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74" }}>
                  <svg viewBox="0 0 24 24" fill="none" className="size-4" style={{ color: "#FF5500" }} aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm" style={{ color: "#44403C" }}>{c}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Results ─────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Results
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Verified Analytics & Results
            </h2>
          </div>
        </Reveal>

        <div ref={resultsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cs.results.map((r, i) => (
            <div key={i} className="result-item flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-6">
              <span className="text-3xl font-extrabold" style={{ color: "#1C1917" }}>
                {r.value}
                <span className="text-[#FF5500]">.</span>
              </span>
              <span className="text-sm font-medium uppercase tracking-wide" style={{ color: "#78716C" }}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Lessons ─────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Lessons & Next Steps
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Key Takeaways
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-4 mb-10">
          {cs.lessons.map((l, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex items-start gap-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-5 text-[#FF5500] mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>{l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FF5500] mb-2">
              Next Steps
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
              {cs.nextSteps}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E7E5E4" }}>
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Achieve Similar Results for Your Brand
            </h2>
            <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "#57534E" }}>
              Get a free audit. We&apos;ll show you exactly where revenue is
              leaking and how to fix it.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get a Free Audit
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-7 py-4 text-[15px] font-semibold transition-all duration-200 hover:bg-stone-50"
                style={{ color: "#1C1917" }}
              >
                View All Case Studies
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
