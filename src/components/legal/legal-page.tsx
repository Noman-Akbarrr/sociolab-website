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
    <div style={{ backgroundColor: "#FAFAF9" }}>
      <Container className="pt-16 pb-20 sm:pt-24">
        <Eyebrow>Legal</Eyebrow>
        {/* Inline colors on purpose: `.site-root h1/h2` in globals.css is
            unlayered and forces white, which beats every Tailwind text
            utility. Inline style is the only thing that outranks it. */}
        <h1
          className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          style={{ color: "#1C1917" }}
        >
          {title}
        </h1>
        <p
          className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: "#78716C" }}
        >
          Last updated: {updated}
        </p>

        <div className="mt-12 max-w-3xl">
          {sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2
                className="mb-4 font-display text-xl font-semibold"
                style={{ color: "#1C1917" }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: "#57534E" }}
                >
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