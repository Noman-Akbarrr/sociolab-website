import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.client} Case Study | Growth Teardown | Sociolab`,
    description: cs.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#FF5500] transition-colors mb-8"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M19 12H5m6-6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Case Studies
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="accent-tint text-xs">{cs.industry}</span>
              <span className="accent-tint text-xs">
                {cs.metric} {cs.metricLabel}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              {cs.client}
            </h1>
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
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
              <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
                {cs.challenge}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
                Starting Baseline
              </p>
              <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
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
              Section 01
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              The Strategy &amp; Creative Hypotheses
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2 md:gap-0">
          {cs.strategy.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex items-start gap-4 py-8 md:px-8 md:py-0 border-[#1E293B] border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0">
                <span className="font-mono text-sm font-bold text-[#FF5500] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-[#CBD5E1]">{s}</p>
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
              Section 02
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Ad Creatives Used
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {cs.creatives.map((c, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex items-start gap-3 rounded-lg border border-[#1E293B] bg-[#111827] p-5">
                <span className="size-8 rounded-md bg-[#FF5500]/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="size-4 text-[#FF5500]" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-[#CBD5E1]">{c}</span>
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
              Section 03
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Verified Analytics &amp; Results
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cs.results.map((r, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex flex-col gap-2 rounded-lg border border-[#1E293B] bg-[#111827] p-6">
                <span className="text-3xl font-extrabold text-white">
                  {r.value}
                  <span className="text-[#FF5500]">.</span>
                </span>
                <span className="text-sm font-medium text-[#94A3B8] uppercase tracking-wide">
                  {r.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Lessons ─────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Section 04
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Revenue Operations Lessons &amp; Next Steps
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
                <p className="text-[15px] leading-relaxed text-[#CBD5E1]">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FF5500] mb-2">
              Next Steps
            </p>
            <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
              {cs.nextSteps}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Achieve Similar Results for Your Brand
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8] max-w-xl mx-auto">
              Get a free acquisition audit. We&apos;ll show you exactly where revenue is
              leaking and how to fix it.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#audit-form"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get a Free Acquisition Audit
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#334155] bg-transparent px-7 py-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:text-[#FF5500]"
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
