import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon } from "@/components/icons";

type ListItem = {
  title: string;
  description: string;
  tags?: string[];
  href?: string;
};

export function DividerList({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: ListItem[];
}) {
  return (
    <Section>
      <Reveal>
        <div className="max-w-3xl mb-12">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-start gap-6 py-8 border-b border-line last:border-b-0"
            >
              <span className="font-mono text-sm font-bold text-brand mt-1 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-muted leading-relaxed text-[15px] mb-3">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="accent-tint text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {item.href && (
                <ArrowRightIcon className="size-5 text-muted group-hover:text-brand transition-colors mt-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
