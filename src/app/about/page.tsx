import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Positioning } from "@/components/home/positioning";
import { MethodSection } from "@/components/home/method-section";
import { Founders } from "@/components/home/founders";

export const metadata: Metadata = {
  title: "About — The Team, Mission & Method Behind Sociolab",
  description:
    "Sociolab is a full-service digital marketing agency in Islamabad & Rawalpindi. Meet our founders, our mission, how we operate, and what makes us different.",
  alternates: {
    canonical: `${site.url}/about`,
  },
};

type Fact = { label: string; value: string; note?: string; stat?: boolean };

const facts: Fact[] = [
  { label: "Founded", value: "2024", note: "Islamabad, Pakistan" },
  { label: "Founders", value: "Noman Akbar Khan & Khizar", note: "Performance + creative" },
  { label: "Based in", value: "Islamabad / Rawalpindi", note: "Serving regional & global clients" },
  { label: "Clients", value: "Pakistan, Middle East, UK & USA", note: "E-commerce, retail, services" },
  { label: "Engagement", value: "Month-to-month", note: "No long-term lock-in" },
  { label: "Onboarding", value: "30 days", note: "Structured roadmap, measurable milestones" },
  { label: "Brands scaled", value: "50+", stat: true },
  { label: "Ad spend managed", value: "PKR 50M+", stat: true },
  { label: "Average ROAS", value: "3–5x", stat: true },
];

const operating = [
  {
    title: "In-house creative studio",
    body: "Video and design are made by our own team — no outsourced production, no context lost in a handoff.",
  },
  {
    title: "Automated creator outreach",
    body: "n8n workflows vet, contact, and manage creators at a scale a manual team can't match.",
  },
  {
    title: "Server-side tracking",
    body: "Conversion API setup recovers the signal iOS privacy changes strip out, so attribution stays honest.",
  },
  {
    title: "WhatsApp-first leads",
    body: "Leads land where your customers already talk — 98% open rates and replies that actually happen.",
  },
  {
    title: "30-day onboarding roadmap",
    body: "Clear milestones from day one to day thirty, so you always know what shipped and what's next.",
  },
  {
    title: "Month-to-month contracts",
    body: "No lock-in. If we stop performing, you shouldn't be trapped in a contract.",
  },
];

const promises = [
  "Revenue reported weekly, not reach",
  "Month-to-month — we earn the next month",
  "One team across ads, social, and web",
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "#F5F5F4" }}>
          <div className="absolute top-[18%] left-[12%] size-2 rounded-full bg-[#FF5500] opacity-10" />
          <div className="absolute top-[38%] right-[15%] size-3 rounded-full bg-[#FF5500] opacity-[0.07]" />
          <div className="absolute top-[64%] left-[22%] size-1.5 rounded-full bg-[#FF5500] opacity-15" />
        </div>

        <Container className="relative">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500]">
                About Sociolab
              </p>
              <h1
                className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
                style={{ color: "#1C1917" }}
              >
                We turn attention into{" "}
                <span className="text-[#FF5500]">conversations</span>.
              </h1>
              <p className="mx-auto mt-7 max-w-[720px] text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
                Sociolab is a full-service digital marketing agency in Islamabad and Rawalpindi.
                We help brands grow through performance marketing, social media, and
                high-converting websites — measured in customers, not impressions.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E04B00]"
                >
                  Work With Us
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-7 py-4 text-[15px] font-semibold transition-all duration-200 hover:bg-stone-50"
                  style={{ color: "#1C1917" }}
                >
                  See Our Work
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── At a glance ─────────────────────────────── */}
      <section>
        <Container className="py-14 sm:py-16">
          <Reveal>
            <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500]">
              At a glance
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <dl
              className="grid gap-px border border-[#E7E5E4] sm:grid-cols-2 lg:grid-cols-3"
              style={{ backgroundColor: "#E7E5E4" }}
            >
              {facts.map((f) => (
                <div key={f.label} className="bg-[#FAFAF9] p-6">
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A8A29E]">
                    {f.label}
                  </dt>
                  <dd
                    className="mt-2 text-lg font-semibold leading-snug"
                    style={{ color: f.stat ? "#FF5500" : "#1C1917" }}
                  >
                    {f.value}
                  </dd>
                  {f.note ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#78716C]">{f.note}</p>
                  ) : null}
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* ── Why we exist ────────────────────────────── */}
      <Section className="border-t border-[#E7E5E4]">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500]">
                Why we exist
              </p>
              <h2 className="leading-[1.12]" style={{ color: "#1C1917" }}>
                Most businesses don&apos;t have a product problem. They have a visibility problem.
              </h2>
              <div className="mt-6 flex max-w-2xl flex-col gap-4 text-[17px] leading-relaxed" style={{ color: "#57534E" }}>
                <p>
                  You&apos;re great at what you do — but your competitors show up everywhere your
                  customers look. Posting without a strategy, agencies reporting on impressions,
                  and a website that doesn&apos;t convert all add up to the same thing: invisible
                  growth.
                </p>
                <p>
                  Sociolab was built to close that gap. One team runs your ads, your social, and
                  your website, so nothing gets lost between specialists — and every decision is
                  measured against one number: customers.
                </p>
                <p>
                  We&apos;re a small, senior team based in Islamabad and Rawalpindi, working with
                  brands across Pakistan, the Middle East, the UK, and the USA.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="h-full rounded-2xl border p-7"
              style={{ background: "linear-gradient(135deg, #FFF7ED, #FFFFFF)", borderColor: "#FDBA74" }}
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5500]">
                Our mission
              </p>
              <p className="mt-3 text-xl font-semibold leading-snug" style={{ color: "#1C1917" }}>
                Turn attention into WhatsApp conversations and retained customers.
              </p>
              <ul className="mt-6 flex flex-col gap-3 border-t pt-5" style={{ borderColor: "#FED7AA" }}>
                {promises.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px]" style={{ color: "#57534E" }}>
                    <svg
                      className="mt-1 size-4 shrink-0 text-[#FF5500]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── How we operate ──────────────────────────── */}
      <Section className="border-t border-[#E7E5E4]">
        <Reveal>
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500]">
              How we operate
            </p>
            <h2 style={{ color: "#1C1917" }}>Six things built into every engagement.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "#64748B" }}>
              Not perks — plumbing. This is the machinery behind the results, and it runs on
              every account we take on.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-x-12 sm:grid-cols-2">
          {operating.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.06}>
              <div className="border-t border-[#E7E5E4] py-6">
                <h3 className="text-lg font-semibold" style={{ color: "#1C1917" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Why Sociolab (edges) ────────────────────── */}
      <Positioning />

      {/* ── Method ──────────────────────────────────── */}
      <MethodSection />

      {/* ── Leadership ──────────────────────────────── */}
      <Founders />

      {/* ── CTA ─────────────────────────────────────── */}
      <div className="border-t border-[#E7E5E4]">
        <Container className="py-16 text-center sm:py-20">
          <Reveal>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500]">
              Next step
            </p>
            <h2 className="mx-auto max-w-2xl" style={{ color: "#1C1917" }}>
              Let&apos;s grow your brand.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed" style={{ color: "#57534E" }}>
              Tell us where you&apos;re stuck — we&apos;ll reply within one business day with a
              free audit and a clear plan.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E04B00]"
              >
                Get in Touch
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-7 py-4 text-[15px] font-semibold transition-all duration-200 hover:bg-stone-50"
                style={{ color: "#1C1917" }}
              >
                View Case Studies
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}
