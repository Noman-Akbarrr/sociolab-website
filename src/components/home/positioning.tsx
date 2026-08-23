import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const edges = [
  {
    num: "01",
    title: "Trend-native",
    body: "We don't guess what's trending — we're the generation scrolling it. Your content is born knowing what will land.",
  },
  {
    num: "02",
    title: "One team, full stack",
    body: "Social, production, marketing, and web under one roof. No handoffs, no misaligned teams, faster than any specialist agency.",
  },
  {
    num: "03",
    title: "WhatsApp-first",
    body: "The market talks on WhatsApp — so we meet them there. 98% open rates, conversations that convert, leads that land in your pocket.",
  },
];

export function Positioning() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why Sociolab"
        title="Built different. On purpose."
        subtitle="Three edges, stacked. Any one is copyable — the combination isn't."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {edges.map((edge, i) => (
          <Reveal key={edge.num} delay={i * 0.08}>
            <div className="group flex h-full flex-col justify-between gap-6 rounded-[3px] bg-ink p-7 text-white transition-transform duration-200 hover:-translate-y-1">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-bright">
                {edge.num}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl font-semibold leading-snug">{edge.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{edge.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}