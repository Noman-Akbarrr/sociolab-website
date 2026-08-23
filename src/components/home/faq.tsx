"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/section";

const faqs = [
  {
    q: "How much does it cost?",
    a: "It depends on scope — platforms, volume, and goals. We'll scope to your objective first and give you a fixed quote before we start. No mystery box, no surprise invoices.",
  },
  {
    q: "How long until I see results?",
    a: "Organic growth compounds — expect early movement in weeks, meaningful results by month three. Paid campaigns move faster, often within the first week. We usually run both so you get quick wins while SEO builds.",
  },
  {
    q: "What's included?",
    a: "Everything is listed in your proposal: deliverables, platforms, posting volume, reporting cadence, and communication. What you see is what we ship — and if something changes, we tell you before it happens.",
  },
  {
    q: "Who is this NOT for?",
    a: "Brands who want overnight magic, or who aren't willing to share their numbers. We win by showing up consistently and measuring honestly. If that's not you, we'll tell you on the first call.",
  },
  {
    q: "What happens when I message you?",
    a: "You get a real person, not a bot. We ask a few questions, give you an honest read on your brand, and if we're not the right fit we'll say so. No pressure, no scripts.",
  },
  {
    q: "Do you work with my industry?",
    a: "We work across industries, but our content engine is strongest where attention moves fast — ecommerce, restaurants, clinics, real estate, and startups. Message us and we'll tell you straight.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section>
      <SectionHeading
        eyebrow="No guesswork"
        title="Before you reach out"
        subtitle="The questions everyone asks. Answered so your first message can be short."
      />
      <div className="mt-12 max-w-3xl divide-y divide-line border-y border-line">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-base font-semibold text-ink sm:text-lg">
                  {faq.q}
                </span>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all ${
                    isOpen ? "rotate-45 border-brand text-brand" : "border-ink/30 text-ink"
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {isOpen && (
                <p className="pb-6 pr-10 text-sm leading-relaxed text-ink/70">{faq.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}