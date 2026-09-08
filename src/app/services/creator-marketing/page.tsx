import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Automated Influencer Marketing & Creator Seeding | Sociolab",
  description:
    "Automated n8n workflows for creator discovery, vetting, contract management, and Meta Partnership Ads whitelisting at scale.",
};

const workflowSteps = [
  {
    num: "01",
    title: "Creator Discovery",
    description:
      "Automated n8n workflows scan creator databases, TikTok Creative Center, and Instagram creator marketplace to identify candidates matching your ICP.",
    details: [
      "Demographic filtering: age, location, niche, audience size",
      "Engagement rate and authenticity scoring",
      "Brand safety checks: content history and audience quality",
    ],
  },
  {
    num: "02",
    title: "Outreach & Vetting",
    description:
      "Personalized outreach sequences at scale. Each creator receives a customized partnership proposal — no generic templates.",
    details: [
      "Automated email/DM sequences with personalized messaging",
      "Portfolio review and content quality assessment",
      "Rate negotiation and contract generation via automated workflows",
    ],
  },
  {
    num: "03",
    title: "Content Production & Seeding",
    description:
      "Product seeding packages dispatched. Creators receive briefs, shooting guidelines, and brand assets — all tracked through our system.",
    details: [
      "Product seeding with tracking and delivery confirmation",
      "Creative brief templates with hook suggestions and brand guidelines",
      "Content review pipeline: first draft → feedback → final approval",
    ],
  },
  {
    num: "04",
    title: "Partnership Ads & Whitelisting",
    description:
      "Run paid ads directly through creator handles for maximum trust and social proof. Meta Partnership Ads unlock new audience segments.",
    details: [
      "Creator handle whitelisting for Meta ads manager access",
      "Spark Ads and Partnership Ads setup and optimization",
      "Performance tracking: creator-level ROAS and CPA attribution",
    ],
  },
];

const whitelistingBenefits = [
  {
    metric: "2–3x",
    label: "Higher CTR",
    description: "Creator-credited ads outperform brand-only ads in click-through rate",
  },
  {
    metric: "40%",
    label: "Lower CPA",
    description: "Trust transfer from creator to brand reduces cost per acquisition",
  },
  {
    metric: "60%",
    label: "Higher Trust",
    description: "Audiences engage more with content that feels native, not广告",
  },
];

export default function CreatorMarketingPage() {
  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Service 03 — Creator Marketing
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Automated Influencer Marketing{" "}
              <span className="text-[#FF5500]">&amp; Creator Seeding</span>
            </h1>
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              We use automated n8n workflows for creator discovery, vetting, contract
              management, and Meta Partnership Ads whitelisting — so you get authentic
              content at scale without the operational overhead.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#roster"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Explore Creator Roster
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

      {/* ── Automated Workflow ──────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Workflow
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              From Discovery to Whitelisting — Fully Automated
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8]">
              Every step of the creator partnership lifecycle is tracked and automated
              through our n8n backend — no manual spreadsheets, no missed follow-ups.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2 md:gap-0">
          {workflowSteps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className="flex flex-col gap-4 py-10 md:px-8 md:py-0 border-[#1E293B] border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-extrabold text-[#FF5500]">
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">
                  {step.description}
                </p>
                <ul className="flex flex-col gap-2 mt-2">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="size-1.5 rounded-full bg-[#FF5500] mt-2 shrink-0" />
                      <span className="text-sm text-[#CBD5E1]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Whitelisting Benefits ───────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Partnership Ads
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Why Creator Whitelisting Works
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8]">
              Running ads through creator handles unlocks trust-based audience segments
              that brand-only campaigns can&apos;t reach.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {whitelistingBenefits.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.08}>
              <div className="flex flex-col gap-3 rounded-lg border border-[#1E293B] bg-[#111827] p-7">
                <span className="text-4xl font-extrabold text-white">
                  {b.metric}
                  <span className="text-[#FF5500]">.</span>
                </span>
                <h3 className="text-lg font-bold text-white">{b.label}</h3>
                <p className="text-sm leading-relaxed text-[#94A3B8]">
                  {b.description}
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
              Ready to Scale with Creators?
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8] max-w-xl mx-auto">
              Explore our creator roster. See the vetted influencers and content creators
              who are already driving results for our clients.
            </p>
            <div className="mt-8">
              <a
                href="#roster"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Explore Creator Roster
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
