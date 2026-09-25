"use client";

import type { Metadata } from "next";
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Meta & Instagram Ads",
    description:
      "Scroll-stopping ad campaigns on Facebook and Instagram that reach your ideal customers and drive real sales — not just likes.",
    details: [
      "Full-funnel campaign strategy",
      "Creative A/B testing",
      "Retargeting & lookalike audiences",
      "Conversion API (CAPI) setup",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Google Ads & Shopping",
    description:
      "Capture high-intent customers actively searching for your products or services on Google Search, Shopping, and YouTube.",
    details: [
      "Search campaign management",
      "Google Shopping feed optimization",
      "YouTube pre-roll ads",
      "Performance Max campaigns",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Analytics & Tracking",
    description:
      "Crystal-clear attribution so you know exactly which ads drive revenue — no more guessing or wasting budget.",
    details: [
      "GA4 event setup",
      "Server-side tracking",
      "UTM taxonomy & reporting",
      "Weekly performance dashboards",
    ],
  },
];

const results = [
  { metric: "3-5x", label: "Average ROAS" },
  { metric: "50+", label: "Brands Scaled" },
  { metric: "PKR 50M+", label: "Ad Spend Managed" },
];

export default function PerformanceMarketingPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current) {
      const items = statsRef.current.querySelectorAll(".stat-item");
      gsap.fromTo(items,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.15,
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" }
        }
      );
    }
    if (stepsRef.current) {
      const steps = stepsRef.current.querySelectorAll(".step-item");
      gsap.fromTo(steps,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.12,
          scrollTrigger: { trigger: stepsRef.current, start: "top 80%" }
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
              Performance Marketing
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
              Ads That Actually{" "}
              <span className="text-[#FF5500]">Drive Revenue</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
              Data-driven Meta and Google ad campaigns engineered to acquire customers
              at a profitable cost. We handle everything from strategy to creative to optimization.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get Free Ad Audit
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

      {/* ── Results Strip ───────────────────────────── */}
      <div style={{ borderTop: "1px solid #E7E5E4", borderBottom: "1px solid #E7E5E4" }}>
        <Container className="py-10">
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.map((r) => (
              <div key={r.label} className="stat-item text-center">
                <div className="text-3xl font-extrabold" style={{ color: "#1C1917" }}>{r.metric}</div>
                <div className="text-sm mt-1" style={{ color: "#78716C" }}>{r.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── What We Do ─────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              What We Do
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Full-Service Performance Marketing
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
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

      {/* ── How It Works ───────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              How It Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              From Audit to Scale in 4 Steps
            </h2>
          </div>
        </Reveal>

        <div ref={stepsRef} className="grid gap-0 md:grid-cols-2 md:gap-0">
          {[
            { num: "01", title: "Audit & Strategy", desc: "We analyze your current ads, competitors, and audience — then build a custom growth plan." },
            { num: "02", title: "Creative & Setup", desc: "Ad creatives, copywriting, tracking setup, and campaign structure — all handled by us." },
            { num: "03", title: "Launch & Monitor", desc: "Campaigns go live. We monitor daily, fix issues fast, and ensure budget is spent wisely." },
            { num: "04", title: "Optimize & Scale", desc: "Weekly reporting, A/B testing, and scaling winning campaigns — we keep improving." },
          ].map((step) => (
            <div key={step.num} className="step-item flex flex-col gap-4 py-10 md:px-8 md:py-0 border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0" style={{ borderColor: "#E7E5E4" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-extrabold text-[#FF5500]">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold" style={{ color: "#1C1917" }}>{step.title}</h3>
              </div>
              <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E7E5E4" }}>
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Ready to Stop Wasting Ad Spend?
            </h2>
            <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "#57534E" }}>
              Get a free audit of your ad accounts. We&apos;ll show you exactly where
              money is leaking and how to fix it.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get Free Ad Audit
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
