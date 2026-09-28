"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  questions: FAQItem[];
}

const faqs: FAQCategory[] = [
  {
    title: "Performance Marketing",
    questions: [
      { q: "What platforms do you run ads on?", a: "Meta, Google, TikTok, LinkedIn. Platform choice depends on your audience and goals." },
      { q: "Minimum ad spend?", a: "PKR 150K/month minimum. E-commerce needs PKR 300K+ for proper testing." },
      { q: "How do you handle iOS tracking?", a: "Server-side CAPI + Enhanced Conversions restores 60-80% lost signal." },
      { q: "Creative testing process?", a: "DCT matrices: 8-12 variations per ad set. Winners get budget reallocated weekly." },
    ]
  },
  {
    title: "Social Media Management",
    questions: [
      { q: "Which platforms?", a: "Instagram, Facebook, LinkedIn, TikTok, X. Mix depends on audience." },
      { q: "Content creation included?", a: "Yes. Strategy, copy, design, Reels/TikTok video, photography, community management." },
      { q: "How measure ROI?", a: "Engagement, follower growth, referral traffic, leads, attributed revenue via UTMs." },
      { q: "Creator/influencer process?", a: "50+ micro-creators monthly, product seeding, hook briefs, UGC collection, whitelisting top performers." },
    ]
  },
  {
    title: "Web Development",
    questions: [
      { q: "What platforms?", a: "Next.js for apps, Shopify for e-commerce, Framer for marketing, WordPress for content." },
      { q: "Handle migrations?", a: "Yes. 20+ Shopify migrations, Next.js rebuilds. SEO preserved via redirects & schema." },
      { q: "Typical timeline?", a: "Landing pages: 2-3 weeks. Marketing sites: 4-6 weeks. E-commerce: 6-8 weeks." },
      { q: "Ongoing maintenance?", a: "Yes. Retainers include updates, monitoring, A/B testing, CRO." },
    ]
  },
  {
    title: "Working With Us",
    questions: [
      { q: "Engagement model?", a: "Monthly retainers from PKR 200K. Project-based available. No long-term contracts, 30-day notice." },
      { q: "Communication & reporting?", a: "Weekly updates, monthly calls, real-time dashboard, quarterly reviews. Direct lead access." },
      { q: "Industry specialization?", a: "E-commerce, D2C, B2B SaaS, automotive, professional services, startups. No gambling/crypto/adult." },
      { q: "How fast to start?", a: "1-2 weeks after agreement. Week 1: audit & setup, then creative production, then launch." },
    ]
  },
];

function CategoryItem({ category, index, isOpen, onToggle }: { 
  category: FAQCategory; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors"
        style={{ backgroundColor: "#F5F5F4" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "#1C1917" }}>
          {category.title}
        </h3>
        <span 
          className="text-xl font-light transition-transform duration-300"
          style={{ 
            color: "#FF5500",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
          }}
        >
          +
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              <div className="space-y-2.5">
                {category.questions.map((q, qIndex) => (
                  <div key={qIndex} className="border-t border-stone-100 pt-2.5">
                    <h4 className="font-semibold text-xs mb-1" style={{ color: "#1C1917" }}>
                      {q.q}
                    </h4>
                    <p className="text-xs leading-snug" style={{ color: "#78716C" }}>
                      {q.a}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-stone-100">
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-1.5 bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
                >
                  Still have questions? Get in Touch →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: "#F5F5F4" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#FF5500" }}>
            Frequently Asked Questions
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1.5 mb-3" style={{ color: "#1C1917" }}>
            Quick Answers
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#57534E" }}>
            Everything about working with Sociolab. <a href="/contact" className="text-[#FF5500] font-medium hover:underline">Get in touch →</a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((category, catIndex) => (
            <CategoryItem
              key={category.title}
              category={category}
              index={catIndex}
              isOpen={openIndex === catIndex}
              onToggle={() => setOpenIndex(openIndex === catIndex ? null : catIndex)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}