import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Stat = {
  value: string;
  label: string;
  sublabel?: string;
};

export function StatStrip({
  eyebrow,
  title,
  stats,
}: {
  eyebrow?: string;
  title?: string;
  stats: Stat[];
}) {
  return (
    <Section>
      <Reveal>
        {(eyebrow || title) && (
          <div className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand mb-4">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-left">
              <div className="text-4xl lg:text-5xl font-extrabold text-white leading-none">
                {stat.value}
                <span className="text-brand">.</span>
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-white">
                {stat.label}
              </p>
              {stat.sublabel && (
                <p className="mt-1 text-xs text-muted">
                  {stat.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
