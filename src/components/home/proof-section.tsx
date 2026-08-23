import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ArrowUpRightIcon } from "@/components/icons";

// TODO: replace with real Sociolab case studies before launch
const cases = [
  {
    client: "Client name",
    service: "Social Media Management",
    metric: "2.4x",
    result: "more qualified enquiries in 4 months",
    href: "/work",
  },
  {
    client: "Client name",
    service: "Digital Marketing",
    metric: "-38%",
    result: "cost per lead on paid campaigns",
    href: "/work",
  },
  {
    client: "Client name",
    service: "Web Development",
    metric: "+61%",
    result: "conversion rate after rebuild",
    href: "/work",
  },
];

export function ProofSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Proof, not promises"
        title="Work that speaks for itself"
        subtitle="Real brands, real numbers. The receipts live on our work page."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cases.map((c, i) => (
          <Reveal key={c.client + i} delay={i * 0.08}>
            <Link
              href={c.href}
              className="group flex h-full flex-col justify-between gap-10 rounded-[3px] border border-line bg-white p-7 transition-colors hover:border-brand"
            >
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/50">
                  {c.service}
                </p>
                <p className="font-display text-4xl font-semibold text-brand">{c.metric}</p>
                <p className="text-sm leading-relaxed text-ink/70">{c.result}</p>
              </div>
              <span className="flex items-center justify-between text-sm font-bold text-ink">
                {c.client}
                <ArrowUpRightIcon className="size-4 text-ink/40 transition-colors group-hover:text-brand" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}