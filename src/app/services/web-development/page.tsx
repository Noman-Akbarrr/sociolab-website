import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Web Development Services | Sociolab",
  description:
    "High-converting websites, landing pages, and e-commerce stores built to turn your traffic into paying customers. Modern, fast, and conversion-focused.",
};

const services = [
  {
    icon: "bx bx-globe",
    title: "Business Websites",
    description:
      "Professional, modern websites that represent your brand and convert visitors into leads or customers.",
    details: [
      "Custom design & development",
      "Mobile-responsive layouts",
      "SEO-optimized structure",
      "Speed & performance focused",
    ],
  },
  {
    icon: "bx bx-shopping-bag",
    title: "E-Commerce Stores",
    description:
      "Full-featured online stores with payment integration, inventory management, and conversion-optimized checkout.",
    details: [
      "Shopify / WooCommerce setup",
      "Payment gateway integration",
      "Product page optimization",
      "Cart abandonment recovery",
    ],
  },
  {
    icon: "bx bx-layout",
    title: "Landing Pages & Funnels",
    description:
      "High-converting landing pages designed for specific campaigns, lead generation, or product launches.",
    details: [
      "Conversion-focused design",
      "A/B testing setup",
      "Lead capture forms",
      "Pixel & tracking setup",
    ],
  },
];

const technologies = [
  { name: "Next.js", icon: "bx bxl-react" },
  { name: "Shopify", icon: "bx bx-shopping-bag" },
  { name: "WordPress", icon: "bx bxl-wordpress" },
  { name: "Tailwind CSS", icon: "bx bx-palette" },
];

export default function WebDevelopmentPage() {
  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Web Development
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Websites That{" "}
              <span className="text-[#FF5500]">Convert Visitors</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              High-converting websites, landing pages, and e-commerce stores built
              to turn your traffic into paying customers. Modern, fast, and built for results.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get Free Website Audit
                <i className="bx bx-right-arrow-alt text-xl" />
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#334155] bg-transparent px-7 py-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:text-[#FF5500]"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── What We Build ──────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              What We Build
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Websites Designed for Results
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#1E293B] bg-[#111827]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.2)" }}>
                  <i className={`${service.icon} text-2xl`} style={{ color: "#FF5500" }} />
                </div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#1E293B]">
                  {service.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <i className="bx bx-check text-sm mt-0.5 flex-shrink-0" style={{ color: "#FF5500" }} />
                      <span className="text-sm text-[#CBD5E1]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Process ────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              From Idea to Launch in 3 Steps
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-3 md:gap-0">
          {[
            { num: "01", title: "Discover & Plan", desc: "We understand your business, audience, and goals — then plan the perfect website." },
            { num: "02", title: "Design & Build", desc: "Custom design, development, and content — all built for speed and conversions." },
            { num: "03", title: "Launch & Support", desc: "We launch your site, set up analytics, and provide ongoing support and updates." },
          ].map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className="flex flex-col gap-4 py-10 md:px-8 md:py-0 border-[#1E293B] border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-extrabold text-[#FF5500]">
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Technologies ───────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Technologies
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Built with Modern Tech
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-4">
          {technologies.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[#1E293B] bg-[#111827] text-center">
                <i className={`${t.icon} text-3xl`} style={{ color: "#FF5500" }} />
                <span className="text-sm font-semibold text-white">{t.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Ready for a Website That Actually Converts?
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8] max-w-xl mx-auto">
              Get a free website audit. We&apos;ll show you what&apos;s hurting your
              conversions and how to fix it.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get Free Website Audit
                <i className="bx bx-right-arrow-alt text-xl" />
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
