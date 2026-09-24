"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";

const categories = [
  { key: "all", label: "All" },
  { key: "ecommerce", label: "E-Commerce" },
  { key: "automotive", label: "Automotive" },
  { key: "b2b", label: "Digital Marketing" },
];

export default function CaseStudiesPage() {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? caseStudies
      : caseStudies.filter((cs) => cs.category === active);

  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Work
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Results That{" "}
              <span className="text-[#FF5500]">Speak</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              Real businesses, real results. See how we&apos;ve helped brands grow
              through performance marketing, social media, and web development.
            </p>
          </div>
        </Reveal>
      </Container>

      {/* ── Filter Tabs ─────────────────────────────── */}
      <div className="border-b border-[#1E293B]">
        <Container>
          <Reveal>
            <div className="flex gap-1 overflow-x-auto py-1 -mb-px">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  className={`whitespace-nowrap px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                    active === cat.key
                      ? "border-[#FF5500] text-[#FF5500]"
                      : "border-transparent text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Reveal>
        </Container>
      </div>

      {/* ── Case Study Grid ─────────────────────────── */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.06}>
              <CaseStudyCard cs={cs} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#94A3B8] py-12">
            No case studies in this category yet.
          </p>
        )}
      </Section>
    </main>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="group flex flex-col gap-5 rounded-lg border border-[#1E293B] bg-[#111827] p-7 transition-all duration-200 hover:border-[#FF5500]/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white group-hover:text-[#FF5500] transition-colors">
            {cs.client}
          </h2>
          <p className="text-sm text-[#94A3B8] mt-0.5">{cs.industry}</p>
        </div>
        <span className="accent-tint text-xs shrink-0">
          {cs.metric} {cs.metricLabel}
        </span>
      </div>

      <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
        {cs.summary}
      </p>

      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5500] mt-auto">
        Read Case Study
        <i className="bx bx-right-arrow-alt text-lg transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
