"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function CaseStudiesPage() {
  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Work
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
              Results That{" "}
              <span className="text-[#FF5500]">Speak</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
              Real businesses, real results. See how we&apos;ve helped brands grow
              through performance marketing, social media, and web development.
            </p>
          </div>
        </Reveal>
      </Container>

      {/* ── Case Study List ─────────────────────────── */}
      <Section className="pb-20">
        <div className="flex flex-col gap-6">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.06}>
              <CaseStudyCard cs={cs} />
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <FollowerPointerCard title={cs.client}>
      <Link href={`/case-studies/${cs.slug}`}>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
          className="flex flex-col md:flex-row gap-6 rounded-xl border border-stone-200 bg-white p-7 transition-colors group"
          style={{ cursor: "none" }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-lg font-bold group-hover:text-[#FF5500] transition-colors" style={{ color: "#1C1917" }}>
                  {cs.client}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "#78716C" }}>{cs.industry}</p>
              </div>
              <span className="text-xs shrink-0 font-mono font-semibold text-[#FF5500]">
                {cs.metric} {cs.metricLabel}
              </span>
            </div>

            <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#57534E" }}>
              {cs.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {cs.results.slice(0, 3).map((r, i) => (
                <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F5F5F4", color: "#57534E" }}>
                  {r.label}: {r.value}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5500] mt-auto">
              Read Case Study
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </motion.div>
      </Link>
    </FollowerPointerCard>
  );
}