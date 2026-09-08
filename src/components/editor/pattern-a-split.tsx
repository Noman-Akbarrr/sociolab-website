import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type SplitItem = {
  eyebrow: string;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
};

export function AsymmetricSplit({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: SplitItem[];
}) {
  return (
    <Section>
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="sticky top-28 self-start">
            {eyebrow && (
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand mb-4">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-5 text-lg leading-relaxed text-muted max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-10">
            {items.map((item, i) => (
              <div
                key={i}
                className="group border-b border-line pb-10 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm font-bold text-brand mt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand/70 mb-2">
                      {item.eyebrow}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-[15px]">
                      {item.description}
                    </p>
                    {item.metric && (
                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-white">
                          {item.metric}
                          <span className="text-brand">.</span>
                        </span>
                        {item.metricLabel && (
                          <span className="text-sm text-muted uppercase tracking-wide">
                            {item.metricLabel}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
