import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const meta = [
  { label: "Client", value: "Exact Fashion Store" },
  { label: "Industry", value: "Apparel & Retail" },
  { label: "Channel", value: "Meta Ads (IG & FB)" },
  { label: "Timeline", value: "Independence Day Campaign" },
];

const metrics = [
  { value: "314", label: "Verified Customer WhatsApp Chats" },
  { value: "PKR 22.79", label: "Average Cost Per Inquiring Customer" },
  { value: "PKR 12.67", label: "Cost Per Link Click (CPC)" },
  { value: "30,772", label: "Targeted Impressions Delivered on a PKR 7,157 Budget" },
];

export function ProofSection() {
  return (
    <section className="bg-[#090D16]">
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Proven Execution
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
              How We Unlocked 314 High-Intent Buyer Conversations at PKR 22.79 Each
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#94A3B8] max-w-2xl">
              A transparent teardown of paid acquisition, creative testing, and operational
              bottlenecks.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-lg border border-[#1E293B] bg-[#111827] overflow-hidden">
            {/* ── Meta bar ──────────────────────────── */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-[#1E293B] px-8 py-5">
              {meta.map((m) => (
                <div key={m.label} className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    {m.label}:
                  </span>
                  <span className="text-sm font-medium text-white">{m.value}</span>
                </div>
              ))}
            </div>

            {/* ── Body ──────────────────────────────── */}
            <div className="grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr]">
              {/* Left: Strategy & Execution */}
              <div className="flex flex-col gap-8">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FF5500] mb-3">
                    The Challenge
                  </p>
                  <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
                    The client needed an immediate influx of ready-to-buy customers for their
                    seasonal collection without inflating acquisition costs.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FF5500] mb-3">
                    The Solution
                  </p>
                  <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
                    Deployed a dynamic creative testing matrix pairing multi-outfit catalog
                    carousels with product-focused short-form video hooks.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FF5500] mb-3">
                    The Operational Diagnosis
                  </p>
                  <p className="text-[15px] leading-relaxed text-[#CBD5E1]">
                    Generated 314 customer conversations at PKR 22.79 per chat. Identified that
                    sales drop-offs occurred in post-click handling (delayed WhatsApp response
                    times), leading to our implementation of structured sales triage protocols.
                  </p>
                </div>
              </div>

              {/* Right: Metric Grid */}
              <div className="grid grid-cols-2 gap-6">
                {metrics.map((m, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-3xl font-extrabold text-white leading-none">
                      {m.value}
                      <span className="text-[#FF5500]">.</span>
                    </span>
                    <span className="mt-2 text-xs font-medium uppercase tracking-wide text-[#94A3B8] leading-snug">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Bottom CTA ────────────────────────── */}
            <div className="border-t border-[#1E293B] px-8 py-5">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-lg border border-[#334155] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.05)] hover:text-[#FF5500]"
              >
                Read Full Performance &amp; Operations Report
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </section>
  );
}
