import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const phases = [
  {
    days: "Days 1–7",
    title: "Strategic Intake & Tracking Foundation",
    description:
      "Technical audit of Meta Pixel, CAPI, and ad accounts. Creative moodboard and ICP creator roster defined.",
  },
  {
    days: "Days 8–14",
    title: "Studio Production & Creator Seeding",
    description:
      "Batch shoots executed. High-converting direct-response scripts edited. Product seeding packages dispatched.",
  },
  {
    days: "Days 15–21",
    title: "Campaign Rollout & Partnership Ads",
    description:
      "Top-of-funnel prospecting ads launch alongside organic content calendar and creator whitelisting.",
  },
  {
    days: "Days 22–30",
    title: "Algorithmic Optimization & Scaling Blueprint",
    description:
      "Daily budget reallocation to winning creative angles. Full-month data review and Month 2 growth blueprint delivered.",
  },
];

export function Roadmap() {
  return (
    <section className="bg-[#090D16]">
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Launch Timeline
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
              Your 30-Day Onboarding &amp; Launch Roadmap
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8] max-w-2xl">
              From technical audit to algorithmic scaling — a clear, accountable path to
              measurable results.
            </p>
          </div>
        </Reveal>

        {/* ── Desktop: Horizontal timeline ──────────── */}
        <div className="hidden md:block">
          <Reveal>
            <div className="grid grid-cols-4 gap-0">
              {phases.map((phase, i) => (
                <div
                  key={phase.days}
                  className="relative border-r border-[#1E293B] px-6 py-0 last:border-r-0"
                >
                  {/* Top connector line */}
                  <div className="flex items-center mb-6">
                    <div className="size-3 rounded-full bg-[#FF5500] shrink-0" />
                    {i < phases.length - 1 && (
                      <div className="h-px flex-1 bg-[#FF5500]/30 ml-1" />
                    )}
                  </div>

                  <span className="font-mono text-xs font-bold text-[#FF5500]">
                    {phase.days}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-white leading-snug">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Mobile: Vertical timeline ─────────────── */}
        <div className="md:hidden flex flex-col gap-0">
          {phases.map((phase, i) => (
            <Reveal key={phase.days} delay={i * 0.08}>
              <div className="relative flex gap-5 pb-10 last:pb-0">
                {/* Vertical connector */}
                <div className="flex flex-col items-center">
                  <div className="size-3 rounded-full bg-[#FF5500] shrink-0" />
                  {i < phases.length - 1 && (
                    <div className="w-px flex-1 bg-[#FF5500]/30 mt-2" />
                  )}
                </div>

                <div>
                  <span className="font-mono text-xs font-bold text-[#FF5500]">
                    {phase.days}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-white leading-snug">
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                    {phase.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}
