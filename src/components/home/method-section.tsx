import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    num: "01",
    title: "Listen",
    body: "Trend and audience intelligence. What your market scrolls, when, and why.",
  },
  {
    num: "02",
    title: "Create",
    body: "Production. Content, creative, and campaigns built to stop the thumb.",
  },
  {
    num: "03",
    title: "Share",
    body: "Distribution across the right platforms, timed to perform.",
  },
  {
    num: "04",
    title: "Convert",
    body: "Turning attention into conversations — on WhatsApp, where your customers already are.",
  },
];

export function MethodSection() {
  return (
    <Section className="bg-ink text-white">
      <SectionHeading
        dark
        eyebrow="The Sociolab Method"
        title="How we move your brand forward"
        subtitle="Four steps. Every one of them has a reason to exist — they're the whole machine."
      />
      <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.num} delay={i * 0.08}>
            <li className="flex h-full flex-col gap-4 border-t-2 border-brand-bright pt-5">
              <span className="font-display text-3xl font-semibold text-brand-bright">
                {step.num}
              </span>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}