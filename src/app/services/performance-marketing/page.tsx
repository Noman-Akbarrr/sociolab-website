import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Performance Marketing Services | Sociolab",
  description:
    "Data-driven Meta and Google ad campaigns engineered to acquire customers at a profitable cost. Full-funnel performance marketing for growing brands.",
};

const services = [
  {
    icon: "bx bxl-meta",
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
    icon: "bx bxl-google",
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
    icon: "bx bx-line-chart",
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
  { metric: "3-5x", label: "Average ROAS", icon: "bx bx-trending-up" },
  { metric: "50+", label: "Brands Scaled", icon: "bx bx-group" },
  { metric: "PKR 50M+", label: "Ad Spend Managed", icon: "bx bx-dollar" },
];

export default function PerformanceMarketingPage() {
  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Performance Marketing
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Ads That Actually{" "}
              <span className="text-[#FF5500]">Drive Revenue</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              Data-driven Meta and Google ad campaigns engineered to acquire customers
              at a profitable cost. We handle everything from strategy to creative to optimization.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get Free Ad Audit
                <i className="bx bx-right-arrow-alt text-xl" />
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#334155] bg-transparent px-7 py-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:text-[#FF5500]"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── Results Strip ───────────────────────────── */}
      <div className="border-y border-[#1E293B]">
        <Container className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.08}>
                <div className="text-center">
                  <i className={`${r.icon} text-3xl mb-3`} style={{ color: "#FF5500" }} />
                  <div className="text-3xl font-extrabold text-white">{r.metric}</div>
                  <div className="text-sm text-[#94A3B8] mt-1">{r.label}</div>
                </div>
              </Reveal>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Full-Service Performance Marketing
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#1E293B] bg-[#111827]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.2)" }}>
                  <i className={`${service.icon} text-2xl`} style={{ color: "#FF5500" }} />
                </div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#1E293B]">
                  {service.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <i className="bx bx-check text-sm mt-0.5 flex-shrink-0" style={{ color: "#FF5500" }} />
                      <span className="text-sm text-[#CBD5E1]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              From Audit to Scale in 4 Steps
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2 md:gap-0">
          {[
            { num: "01", title: "Audit & Strategy", desc: "We analyze your current ads, competitors, and audience — then build a custom growth plan." },
            { num: "02", title: "Creative & Setup", desc: "Ad creatives, copywriting, tracking setup, and campaign structure — all handled by us." },
            { num: "03", title: "Launch & Monitor", desc: "Campaigns go live. We monitor daily, fix issues fast, and ensure budget is spent wisely." },
            { num: "04", title: "Optimize & Scale", desc: "Weekly reporting, A/B testing, and scaling winning campaigns — we keep improving." },
          ].map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className="flex flex-col gap-4 py-10 md:px-8 md:py-0 border-[#1E293B] border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-extrabold text-[#FF5500]">
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Ready to Stop Wasting Ad Spend?
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8] max-w-xl mx-auto">
              Get a free audit of your ad accounts. We&apos;ll show you exactly where
              money is leaking and how to fix it.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get Free Ad Audit
                <i className="bx bx-right-arrow-alt text-xl" />
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
