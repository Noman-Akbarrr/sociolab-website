import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

// TODO: replace with real client testimonials before launch
const testimonials = [
  {
    quote:
      "They get what we don't. Content finally feels like our brand, and the enquiries actually show up.",
    name: "Client name",
    role: "Founder, Company",
  },
  {
    quote:
      "First agency that talks in results instead of jargon. WhatsApp-first turned our enquiry flow around.",
    name: "Client name",
    role: "Marketing Lead, Company",
  },
];

export function Testimonials() {
  return (
    <Section className="bg-mist">
      <SectionHeading
        eyebrow="The feeling"
        title="Clients who felt the difference"
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name + i} delay={i * 0.08}>
            <figure className="flex h-full flex-col justify-between gap-8 rounded-[3px] bg-white p-8">
              <blockquote className="font-display text-xl font-medium leading-snug text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{t.name}</span>
                  <span className="block text-xs text-ink/55">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}