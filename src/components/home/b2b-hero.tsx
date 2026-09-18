"use client";

import { MegaphoneIcon } from "./megaphone-icon";

export function B2BHero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#FAFAF9" }}>
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF5500 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-[1240px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "#FF5500" }}
          />
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "#FF5500" }}
          >
            Performance Media &amp; Creative Growth
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold leading-[1.05] mb-8" style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", letterSpacing: "-0.03em", color: "#1C1917" }}>
          Scale Faster
          <br />
          <span className="flex items-center flex-wrap gap-x-4 gap-y-2">
            <span>with</span>
            <MegaphoneIcon className="inline-block w-[1.1em] h-[1.1em] flex-shrink-0 -mt-1" />
            <span>Digital</span>
          </span>
          Marketing
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-xl text-base md:text-lg leading-relaxed mb-10"
          style={{ color: "#57534E" }}
        >
          We engineer predictable acquisition funnels using data-driven paid advertising,
          high-converting creative, and creator partnerships that scale.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-16">
          <a
            href="#diagnostic-form"
            className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
          >
            Get Free Audit
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 font-semibold px-7 py-4 rounded-xl transition-all duration-200 border border-stone-200"
            style={{ color: "#1C1917" }}
          >
            View Case Studies
          </a>
        </div>

        {/* Trust strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-xs" style={{ color: "#A8A29E" }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: "#059669" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>No lock-in contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: "#059669" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Results in 30 days</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: "#059669" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>$2M+ ad spend managed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
