import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const problems = [
  {
    index: "01",
    label: "The Deliverable Trap",
    title: "Posting Content for the Sake of Posting",
    description:
      "Most agencies sell you '12 Reels and 8 Carousels a month' like a factory. They fulfill their checklist, but your bank account doesn't grow. Volume without direct-response strategy is just expensive feed clutter.",
  },
  {
    index: "02",
    label: "The Attribution Disconnect",
    title: "Ad Spend Disconnected from Real Sales",
    description:
      "Media buyers run generic traffic campaigns while your post-click operations bleed revenue. Without custom Conversion APIs, server-side tracking, and chat/landing page sales triage, high ad spend results in low profit.",
  },
  {
    index: "03",
    label: "Creative Burnout & Ad Fatigue",
    title: "Recycling Boring, Uninspired Creatives",
    description:
      "Meta's algorithm demands rapid creative testing. Relying on basic Canva templates causes ad fatigue within weeks. You need a dedicated production engine pumping fresh hooks, authentic UGC, and dynamic angles into your campaigns.",
  },
];

export function Problem() {
  return (
    <section className="bg-[#090D16]">
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              The Bottleneck
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
              Why Most Marketing Retainers Fail to Generate Revenue
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-3 md:gap-0">
          {problems.map((item, i) => (
            <Reveal key={item.index} delay={i * 0.08}>
              <div className="flex flex-col py-10 md:px-8 md:py-0 md:border-r border-[#1E293B] last:border-r-0 last:border-b md:border-b-0 border-b">
                <div className="mb-6">
                  <span className="font-mono text-sm font-bold text-[#FF5500]">
                    {item.index}
                  </span>
                  <span className="font-mono text-sm text-[#94A3B8] ml-2">
                    / {item.label.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Transition Callout ───────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-8 sm:py-10">
          <Reveal>
            <p className="text-center text-base sm:text-lg font-medium text-white max-w-3xl mx-auto leading-relaxed">
              Sociolab was built to solve this exact gap.{" "}
              <span className="text-[#FF5500]">
                We unify creative studio production with algorithmic performance media.
              </span>
            </p>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
