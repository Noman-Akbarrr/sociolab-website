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
      {
        q: "What platforms do you run ads on?",
        a: "We run campaigns across Meta (Facebook & Instagram), Google (Search, Shopping, YouTube, Display), TikTok, and LinkedIn. Platform selection depends on your audience and objectives."
      },
      {
        q: "What's your minimum ad spend requirement?",
        a: "We typically recommend a minimum of PKR 150K/month for meaningful data and optimization. For e-commerce brands, PKR 300K+ allows proper testing matrices."
      },
      {
        q: "How do you track conversions with iOS privacy changes?",
        a: "We implement server-side Meta CAPI and Google Enhanced Conversions alongside pixel tracking. This restores 60-80% of lost signal from iOS 14+ privacy updates."
      },
      {
        q: "What's your creative testing process?",
        a: "We use Dynamic Creative Testing (DCT) matrices: 8-12 variations per ad set testing hooks, formats, and angles. Winners get budget reallocated weekly."
      },
    ]
  },
  {
    title: "Social Media Management",
    questions: [
      {
        q: "Which platforms do you manage?",
        a: "Instagram, Facebook, LinkedIn, TikTok, and X (Twitter). Platform mix depends on your audience - B2B brands prioritize LinkedIn, D2C brands prioritize Instagram/TikTok."
      },
      {
        q: "Do you create content or just schedule it?",
        a: "Full creative production: strategy, copywriting, design, Reels/TikTok video production, photography direction, and community management. We handle everything end-to-end."
      },
      {
        q: "How do you measure social ROI?",
        a: "We track engagement rate, follower growth, referral traffic, lead generation, and attributed revenue via UTM tracking and platform analytics dashboards."
      },
      {
        q: "What's your creator/influencer process?",
        a: "We run a seeded creator program: identify 50+ micro-creators monthly, ship product, brief on hooks, collect UGC, whitelist top performers for paid amplification."
      },
    ]
  },
  {
    title: "Web Development",
    questions: [
      {
        q: "What platforms do you build on?",
        a: "Next.js for custom web apps, Shopify for e-commerce, Framer for marketing sites, WordPress for content-heavy sites. Platform choice depends on your needs."
      },
      {
        q: "Do you handle migrations and redesigns?",
        a: "Yes. We've migrated 20+ stores to Shopify and rebuilt dozens of sites on Next.js. We preserve SEO equity via proper redirects, schema, and Core Web Vitals optimization."
      },
      {
        q: "What's your typical timeline?",
        a: "Landing pages: 2-3 weeks. Full marketing sites: 4-6 weeks. E-commerce stores: 6-8 weeks. Includes strategy, design, dev, QA, and launch."
      },
      {
        q: "Do you provide ongoing maintenance?",
        a: "Yes. Retainer options include security updates, content updates, performance monitoring, A/B testing, and conversion rate optimization."
      },
    ]
  },
  {
    title: "Working With Us",
    questions: [
      {
        q: "What's your typical engagement model?",
        a: "Monthly retainers starting at PKR 200K/month. Project-based work available for web dev and one-off campaigns. No long-term contracts - 30-day notice to pause/cancel."
      },
      {
        q: "How do you communicate and report?",
        a: "Weekly Slack/email updates, monthly performance calls, real-time dashboard access, and quarterly strategy reviews. Direct access to your account lead."
      },
      {
        q: "What industries do you specialize in?",
        a: "E-commerce (fashion, beauty, electronics), D2C brands, B2B SaaS, automotive, professional services, and startups. We don't work with gambling, crypto, or adult industries."
      },
      {
        q: "How fast can we start?",
        a: "Typically 1-2 weeks after signed agreement. We begin with audit & setup week, then move to creative/asset production, then launch."
      },
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
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
        style={{ backgroundColor: "#F5F5F4" }}
      >
        <h3 className="text-lg font-bold" style={{ color: "#1C1917" }}>
          {category.title}
        </h3>
        <span 
          className="text-2xl font-light transition-transform duration-300"
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                {category.questions.map((q, qIndex) => (
                  <div key={qIndex} className="border-t border-stone-100 pt-4">
                    <h4 className="font-semibold text-base mb-2" style={{ color: "#1C1917" }}>
                      {q.q}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#57534E" }}>
                      {q.a}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-stone-100">
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold px-6 py-3 rounded-lg transition-all"
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
    <section className="py-16 md:py-24" style={{ backgroundColor: "#F5F5F4" }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#FF5500" }}>
            Frequently Asked Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: "#1C1917" }}>
            Quick Answers
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#57534E" }}>
            Everything you need to know about working with Sociolab. Can't find your answer? <a href="/contact" className="text-[#FF5500] font-medium hover:underline">Get in touch →</a>
          </p>
        </div>

        <div className="space-y-4">
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