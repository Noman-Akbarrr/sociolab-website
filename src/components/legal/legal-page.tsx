import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";

export type LegalSection = { heading: string; paragraphs: string[] };

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-white">
      <Container className="pt-16 pb-20 sm:pt-24">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
          Last updated: {updated}
        </p>

        <div className="mt-12 max-w-3xl">
          {sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="mb-4 font-display text-xl font-semibold text-ink">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mb-4 text-sm leading-relaxed text-ink/75">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}