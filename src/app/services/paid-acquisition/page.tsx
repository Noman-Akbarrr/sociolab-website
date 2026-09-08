import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Paid Media & Performance Marketing Services | Sociolab",
  description:
    "Algorithmic Meta Ads (CAPI, DCT, full-funnel remarketing) and Google Ads (Search, Shopping, Performance Max) management engineered for profitable scale.",
};

const funnelTiers = [
  {
    stage: "TOFU",
    label: "Top of Funnel",
    allocation: "40–50%",
    description: "Cold audience prospecting via broad targeting, lookalikes, and interest-based campaigns.",
    channels: ["Meta Reels & Stories", "YouTube Pre-Roll", "Google Discovery"],
  },
  {
    stage: "MOFU",
    label: "Middle of Funnel",
    allocation: "25–35%",
    description: "Warm retargeting: video viewers, site visitors, engaged audiences.",
    channels: ["Meta Carousel Retargeting", "Google Search (Brand)", "YouTube Retargeting"],
  },
  {
    stage: "BOFU",
    label: "Bottom of Funnel",
    allocation: "20–30%",
    description: "High-intent conversion: cart abandoners, product page visitors, lead form drop-offs.",
    channels: ["Meta Dynamic Product Ads", "Google Shopping", "WhatsApp Retargeting"],
  },
];

const capabilities = [
  {
    title: "Meta Ads Architecture",
    items: [
      "Server-side Conversion API (CAPI) to prevent signal loss from iOS tracking changes",
      "Dynamic Creative Testing (DCT) — 5–10 ad variations per ad set, auto-optimized by Meta's algorithm",
      "Full-funnel retargeting loops: View Content → Add to Cart → Initiate Checkout → Purchase",
      "Custom audience stacking: email lists, website visitors, engagers, and lookalikes",
    ],
  },
  {
    title: "Google Ads Management",
    items: [
      "Search campaigns targeting high-intent commercial queries with ad extensions",
      "Google Shopping feed optimization for e-commerce product visibility",
      "Performance Max campaigns with asset group segmentation by product category",
      "YouTube pre-roll and in-feed ads for top-of-funnel awareness at scale",
    ],
  },
  {
    title: "Technical Attribution",
    items: [
      "GA4 custom event tracking with enhanced e-commerce parameters",
      "Server-side tagging via Google Tag Manager for data resilience",
      "UTM taxonomy and cross-channel attribution modeling",
      "Weekly performance dashboards with spend, ROAS, CPA, and LTV metrics",
    ],
  },
];

export default function PaidAcquisitionPage() {
  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Service 01 — Paid Acquisition
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Algorithmic Meta &amp; Google{" "}
              <span className="text-[#FF5500]">Ad Management</span>
            </h1>
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              We engineer predictable customer acquisition funnels using data-driven paid
              advertising, server-side tracking, and rapid creative testing — so every
              rupee of ad spend moves your bottom line.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#audit-form"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5 active:translate-y-0"
              >
                Audit My Ad Account
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#334155] bg-transparent px-7 py-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:text-[#FF5500]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── Budget Allocation Matrix ────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Budget Strategy
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Full-Funnel Budget Allocation
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8]">
              We allocate spend across the entire funnel — not just top-of-funnel vanity
              metrics — to ensure every stage drives measurable revenue.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {funnelTiers.map((tier, i) => (
            <Reveal key={tier.stage} delay={i * 0.08}>
              <div className="flex flex-col gap-5 rounded-lg border border-[#1E293B] bg-[#111827] p-7">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-extrabold text-[#FF5500]">
                    {tier.stage}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {tier.allocation}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{tier.label}</h3>
                <p className="text-sm leading-relaxed text-[#94A3B8]">
                  {tier.description}
                </p>
                <ul className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#1E293B]">
                  {tier.channels.map((ch) => (
                    <li key={ch} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                      <span className="size-1.5 rounded-full bg-[#FF5500] shrink-0" />
                      {ch}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Capabilities Deep Dive ──────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Technical Depth
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              How We Engineer Profitable Acquisition
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 0.08}>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white border-b border-[#1E293B] pb-4">
                  {cap.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {cap.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
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
                      <span className="text-[15px] leading-relaxed text-[#CBD5E1]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
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
              Get a free audit of your Meta and Google ad accounts. We&apos;ll identify
              exactly where revenue is leaking.
            </p>
            <div className="mt-8">
              <a
                href="#audit-form"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Audit My Ad Account
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
