import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    title: "Listen",
    body: "Trend and audience intelligence. What your market scrolls, when, and why.",
  },
  {
    title: "Create",
    body: "Production. Content, creative, and campaigns built to stop the thumb.",
  },
  {
    title: "Share",
    body: "Distribution across the right platforms, timed to perform.",
  },
  {
    title: "Convert",
    body: "Turning attention into conversations — on WhatsApp, where your customers already are.",
  },
];

export function MethodSection() {
  return (
    <Section className="bg-[#111827] text-white">
      <SectionHeading
        dark
        eyebrow="The Sociolab Method"
        title="How we move your brand forward"
        subtitle="Four steps. Every one of them has a reason to exist — they're the whole machine."
      />
      <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <li className="flex h-full flex-col gap-4 border-t-2 border-brand-bright pt-5">
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}