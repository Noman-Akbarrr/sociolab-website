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

      <div className="relative max-w-[1240px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-24 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "#FF5500" }}
          />
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "#FF5500" }}
          >
            Digital Marketing Agency
          </span>
        </div>

        {/* Headline — centered */}
        <h1
          className="font-display font-extrabold leading-[1.05] mb-8"
          style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", letterSpacing: "-0.03em", color: "#1C1917" }}
        >
          Scale Faster
          <br />
          <span className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
            <span>with</span>
            <span>Digital</span>
            <MegaphoneIcon className="inline-block w-[1.1em] h-[1.1em] flex-shrink-0 -mt-1" />
            <span>Marketing</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-10"
          style={{ color: "#57534E" }}
        >
          We help brands grow with performance marketing, social media management,
          and high-converting websites — all under one roof.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a
            href="#diagnostic-form"
            className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
          >
            Get Free Audit
            <i className="bx bx-right-arrow-alt text-xl" />
          </a>
          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 font-semibold px-7 py-4 rounded-xl transition-all duration-200 border border-stone-200"
            style={{ color: "#1C1917" }}
          >
            View Our Work
          </a>
        </div>

        {/* Trust strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs" style={{ color: "#A8A29E" }}>
          <div className="flex items-center gap-2">
            <i className="bx bx-check-circle text-sm" style={{ color: "#059669" }} />
            <span>No lock-in contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="bx bx-check-circle text-sm" style={{ color: "#059669" }} />
            <span>Results in 30 days</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="bx bx-check-circle text-sm" style={{ color: "#059669" }} />
            <span>50+ brands served</span>
          </div>
        </div>
      </div>
    </section>
  );
}
