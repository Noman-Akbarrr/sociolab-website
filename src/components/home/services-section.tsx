import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const pillars = [
  {
    index: "01",
    eyebrow: "Paid Acquisition",
    title: "Algorithmic Meta & Google Ad Management",
    bullets: [
      "Dynamic Creative Testing (DCT) architecture to isolate winning angles rapidly.",
      "Server-side Meta Conversion API (CAPI) & GA4 custom event tracking to prevent signal loss.",
      "Full-funnel budget scaling: Top-of-funnel prospecting down to high-intent retargeting loops.",
    ],
  },
  {
    index: "02",
    eyebrow: "Creative Studio",
    title: "Short-Form Video & Visual Assets Engineered to Convert",
    bullets: [
      "Scripted hooks, problem-solution angles, and platform-native pacing for TikTok & Reels.",
      "Educational carousels and high-impact statics designed for swipe-through and click-through rates.",
      "Multi-variation cutdowns tested weekly to actively fight creative ad fatigue.",
    ],
  },
  {
    index: "03",
    eyebrow: "Creator Marketing",
    title: "Systematized Influencer Partnerships & PR Seeding",
    bullets: [
      "Automated creator discovery and personalized outreach powered by custom n8n backend workflows.",
      "Vetted creator rosters aligned strictly with your brand ICP and target customer demographics.",
      "Partnership / Spark Ads whitelisting: running paid ads directly through creator handles for maximum trust.",
    ],
  },
  {
    index: "04",
    eyebrow: "Revenue Operations",
    title: "Post-Click Conversion & Lead Triage Optimization",
    bullets: [
      "Landing page and Shopify store conversion rate optimization (CRO) audits.",
      "Retention marketing: automated abandoned cart and welcome email flows.",
      "Lead handling protocols: diagnosing response time bottlenecks in WhatsApp/CRM pipelines to maximize order confirmations.",
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="bg-[#090D16]">
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Capabilities
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
              An Integrated Engine for Predictable Acquisition
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8] max-w-2xl">
              No silos. No outsourced handoffs. We run every critical layer required to
              scale your customer base.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-0">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.index} delay={i * 0.06}>
              <div
                className={`grid gap-8 py-12 border-[#1E293B] md:grid-cols-[1fr_1.2fr] ${
                  i !== pillars.length - 1 ? "border-b" : ""
                } ${i % 2 === 0 ? "" : "md:direction-rtl"}`}
                style={i % 2 !== 0 ? { direction: "rtl" } : undefined}
              >
                {/* Left / alternating right */}
                <div style={i % 2 !== 0 ? { direction: "ltr" } : undefined}>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-mono text-sm font-bold text-[#FF5500]">
                      {pillar.index}
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                      {pillar.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-snug">
                    {pillar.title}
                  </h3>
                </div>

                {/* Right / alternating left */}
                <ul
                  className="flex flex-col gap-4"
                  style={i % 2 !== 0 ? { direction: "ltr" } : undefined}
                >
                  {pillar.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-5 text-[#FF5500] mt-0.5 shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[15px] leading-relaxed text-[#CBD5E1]">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}
