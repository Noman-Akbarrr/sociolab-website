import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Social Media Management Services | Sociolab",
  description:
    "Strategic social media management, content creation, and community growth across Instagram, Facebook, and TikTok — turning followers into customers.",
};

const services = [
  {
    icon: "bx bx-calendar",
    title: "Content Strategy & Calendar",
    description:
      "A planned, consistent content strategy tailored to your brand voice and audience — no more random posting.",
    details: [
      "Monthly content calendars",
      "Brand voice development",
      "Hashtag research & strategy",
      "Competitor content analysis",
    ],
  },
  {
    icon: "bx bx-video",
    title: "Reels & Short-Form Video",
    description:
      "Scroll-stopping Reels and short-form video content designed for engagement, reach, and conversions.",
    details: [
      "Reels production & editing",
      "Trend-jacking & trending audio",
      "Hook-first storytelling",
      "Multi-platform formatting",
    ],
  },
  {
    icon: "bx bx-message-rounded",
    title: "Community Management",
    description:
      "Active engagement with your audience — replies, DMs, comments — building real relationships and loyalty.",
    details: [
      "Comment & DM management",
      "Review response strategy",
      "Audience engagement campaigns",
      "User-generated content curation",
    ],
  },
  {
    icon: "bx bx-bar-chart-alt-2",
    title: "Analytics & Reporting",
    description:
      "Clear, jargon-free reports showing what&apos;s working, what&apos;s not, and what we&apos;re doing next.",
    details: [
      "Weekly performance reports",
      "Content reach & engagement tracking",
      "Follower growth analytics",
      "Monthly strategy reviews",
    ],
  },
];

export default function SocialMediaPage() {
  return (
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Social Media Management
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Social Media That{" "}
              <span className="text-[#FF5500]">Drives Results</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              Strategic content creation, community management, and growth across
              Instagram, Facebook, and TikTok — turning followers into customers.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get Free Social Audit
                <i className="bx bx-right-arrow-alt text-xl" />
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#334155] bg-transparent px-7 py-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:text-[#FF5500]"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── What We Do ─────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              What We Do
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Full-Service Social Media Management
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
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

      {/* ── Platforms ──────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Platforms We Manage
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white leading-[1.1]">
              Where Your Audience Lives
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "bx bxl-instagram", name: "Instagram", desc: "Reels, Stories, Posts, Carousels — full Instagram management." },
            { icon: "bx bxl-facebook", name: "Facebook", desc: "Page management, groups, ads integration, and community building." },
            { icon: "bx bxl-tiktok", name: "TikTok", desc: "Trend-jacking, short-form video, and viral content strategies." },
          ].map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className="flex flex-col items-center gap-4 p-8 rounded-xl border border-[#1E293B] bg-[#111827] text-center">
                <i className={`${p.icon} text-4xl`} style={{ color: "#FF5500" }} />
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-sm text-[#94A3B8]">{p.desc}</p>
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
              Ready to Grow Your Social Media?
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8] max-w-xl mx-auto">
              Get a free social media audit. We&apos; show you what&apos;s working,
              what&apos;s not, and how to grow.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5"
              >
                Get Free Social Audit
                <i className="bx bx-right-arrow-alt text-xl" />
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
