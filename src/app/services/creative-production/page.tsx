import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Direct-Response Video Production & Creative Studio | Sociolab",
  description:
    "In-house direct-response video production, script frameworks, hook variation matrices, and carousel editorial design engineered to convert.",
};

const processSteps = [
  {
    num: "01",
    title: "Script & Hook Development",
    description:
      "Every video starts with a scripted hook — problem-solution angles, pattern interrupts, and curiosity gaps engineered for the first 3 seconds.",
    details: [
      "Hook variation matrix: 5–10 opening angles per product",
      "Platform-native pacing for TikTok, Reels, and YouTube Shorts",
      "Problem-agitation-solution (PAS) and before-after-bridge (BAB) frameworks",
    ],
  },
  {
    num: "02",
    title: "Production & Shoot",
    description:
      "Macro texture shoots, lifestyle casting, and UGC-style recordings — all executed in-house for speed and quality control.",
    details: [
      "In-house studio with controlled lighting and audio",
      "Multi-angle product macro shots for texture and detail",
      "UGC creator casting aligned with your target demographic",
    ],
  },
  {
    num: "03",
    title: "Edit & Optimize",
    description:
      "Rapid iteration cycles with multi-variation cutdowns. We test different hooks, CTAs, and pacing to find winners.",
    details: [
      "3–5 cutdowns per shoot for A/B testing",
      "Caption styling, motion graphics, and sound design",
      "Platform-specific formatting (9:16, 1:1, 4:5)",
    ],
  },
  {
    num: "04",
    title: "Test & Scale",
    description:
      "Winning creatives get budget. Losers get cut. We actively fight creative fatigue with fresh iterations every week.",
    details: [
      "Weekly creative performance reviews",
      "Fatigue detection: frequency caps and replacement triggers",
      "Winning angle expansion: new hooks, new talent, new contexts",
    ],
  },
];

const hookMatrix = [
  { type: "Problem-Agitate", example: "\"Still wasting money on ads that don't convert?\"", platform: "Meta Reels" },
  { type: "Social Proof", example: "\"314 customers messaged us in 14 days. Here's why.\"", platform: "Instagram Stories" },
  { type: "Before-After", example: "\"This ad was getting 0.8% CTR. We changed one thing.\"", platform: "TikTok" },
  { type: "Curiosity Gap", example: "\"The one metric your agency isn't telling you about.\"", platform: "YouTube Shorts" },
  { type: "Direct Offer", example: "\"Free acquisition audit. We'll show you where money is leaking.\"", platform: "Meta Feed" },
];

export default function CreativeProductionPage() {
  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Service 02 — Creative Studio
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Short-Form Video &amp; Visual Assets{" "}
              <span className="text-[#FF5500]">Engineered to Convert</span>
            </h1>
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              Our in-house creative studio produces direct-response video, carousel
              editorials, and static assets designed to stop the scroll and drive action —
              not just look pretty.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Request Creative Portfolio
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

      {/* ── Production Process ──────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              From Script to Scale in 4 Steps
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2 md:gap-0">
          {processSteps.map((step, i) => (
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

      {/* ── Hook Variation Matrix ───────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Hook Framework
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Hook Variation Matrix
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8]">
              Every video starts with a tested hook. Here are the frameworks we rotate
              through to fight creative fatigue.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="py-4 pr-4 text-sm font-semibold text-[#64748B] uppercase tracking-wide">
                    Hook Type
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-[#64748B] uppercase tracking-wide">
                    Example
                  </th>
                  <th className="py-4 pl-4 text-sm font-semibold text-[#64748B] uppercase tracking-wide">
                    Platform
                  </th>
                </tr>
              </thead>
              <tbody>
                {hookMatrix.map((row, i) => (
                  <tr key={i} className="border-b border-[#1E293B] last:border-b-0">
                    <td className="py-5 pr-4 text-[15px] font-semibold text-white">
                      {row.type}
                    </td>
                    <td className="py-5 px-4 text-[15px] text-[#CBD5E1] italic">
                      {row.example}
                    </td>
                    <td className="py-5 pl-4">
                      <span className="accent-tint text-xs">{row.platform}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Need Creative That Actually Converts?
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8] max-w-xl mx-auto">
              Request our creative portfolio. See the exact video styles and carousel
              formats that drive results for our clients.
            </p>
            <div className="mt-8">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Request Creative Portfolio
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
