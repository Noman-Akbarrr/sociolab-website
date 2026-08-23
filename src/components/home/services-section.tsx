import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ArrowUpRightIcon } from "@/components/icons";

const services = [
  {
    title: "Social Media Management",
    href: "/services/social-media-management",
    body: "Content that trends, communities that engage, and a feed that sells — managed end to end.",
  },
  {
    title: "Digital Marketing",
    href: "/services/digital-marketing",
    body: "Ads, SEO, and campaigns that turn attention into customers you can actually measure.",
  },
  {
    title: "Web Development",
    href: "/services/web-development",
    body: "Fast, beautiful, conversion-built websites that make your brand credible and keep it growing.",
  },
];

export function ServicesSection() {
  return (
    <Section className="bg-mist">
      <SectionHeading
        eyebrow="What we do"
        title="Three capabilities. One goal: your growth."
        subtitle="Pick where you need us. Or don't — we're built to take the whole thing."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.href} delay={i * 0.08}>
            <Link
              href={service.href}
              className="group flex h-full flex-col justify-between gap-8 rounded-[3px] border-2 border-ink bg-white p-7 transition-all duration-200 hover:bg-brand hover:border-brand"
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-white">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/65 transition-colors group-hover:text-white/85">
                  {service.body}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand transition-colors group-hover:text-white">
                Learn more
                <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}