import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const pains = [
  {
    title: "You post every day. Nothing happens.",
    body: "You're showing up, but the algorithm doesn't care. Effort without a strategy is just noise.",
  },
  {
    title: "Your competitors are everywhere. You're invisible.",
    body: "The brand that wins attention wins the customer. Right now, that's not you.",
  },
  {
    title: "Your agency sends reports, not results.",
    body: "Vanity metrics in a pretty deck. You paid for growth and got a monthly PDF.",
  },
];

export function Problem() {
  return (
    <Section className="bg-mist">
      <SectionHeading
        eyebrow="Sound familiar?"
        title="Posting isn't growing."
        subtitle="If any of these feel like you, that's exactly why you're here."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {pains.map((pain, i) => (
          <Reveal key={pain.title} delay={i * 0.08}>
            <div className="flex h-full flex-col gap-3 rounded-[3px] border border-line bg-white p-7">
              <span className="font-display text-2xl font-semibold text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                {pain.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/65">{pain.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}