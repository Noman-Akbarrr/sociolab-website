"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MegaphoneIcon } from "./megaphone-icon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function B2BHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline word stagger
      const h1 = headlineRef.current;
      if (h1) {
        const lines = h1.querySelectorAll(".hero-line");
        gsap.fromTo(lines,
          { opacity: 0, y: 60, rotateX: -15 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
        );
      }

      // Eyebrow
      gsap.fromTo(".hero-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
      );

      // Subheadline + CTAs
      gsap.fromTo(".hero-sub",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.6 }
      );
      gsap.fromTo(".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.8 }
      );

      // Trust strip
      gsap.fromTo(".trust-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 1 }
      );

      // Parallax blobs on scroll
      if (blob1Ref.current) {
        gsap.to(blob1Ref.current, {
          y: -120,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
      if (blob2Ref.current) {
        gsap.to(blob2Ref.current, {
          y: -80,
          x: 40,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ backgroundColor: "#FAFAF9" }}>
      {/* Parallax background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={blob1Ref}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF5500 0%, transparent 70%)" }}
        />
        <div
          ref={blob2Ref}
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 70%)" }}
        />
      </div>

      {/* Decorative line */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.04]" preserveAspectRatio="none">
        <line x1="10%" y1="0" x2="90%" y2="100%" stroke="#1C1917" strokeWidth="1" />
        <line x1="90%" y1="0" x2="10%" y2="100%" stroke="#1C1917" strokeWidth="1" />
      </svg>

      <div className="relative max-w-[1240px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-24 text-center">
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center justify-center gap-2 mb-6 opacity-0">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#FF5500" }} />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#FF5500" }}>
            Digital Marketing Agency
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-extrabold leading-[1.05] mb-8 perspective-[1000px]"
          style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", letterSpacing: "-0.03em", color: "#1C1917" }}
        >
          <span className="hero-line block opacity-0">Scale faster with</span>
          <span className="hero-line flex items-center justify-center flex-wrap gap-x-4 gap-y-2 opacity-0">
            <span>digital</span>
            <MegaphoneIcon className="inline-block w-[1.1em] h-[1.1em] flex-shrink-0 -mt-1" />
            <span>marketing</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-10 opacity-0" style={{ color: "#57534E" }}>
          We help brands grow with performance marketing, social media management,
          and high-converting websites — all under one roof.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a href="#diagnostic-form" className="hero-cta inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 opacity-0">
            Get Free Audit
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a href="#case-studies" className="hero-cta inline-flex items-center gap-2 bg-white hover:bg-stone-50 font-semibold px-7 py-4 rounded-xl transition-all duration-200 border border-stone-200 opacity-0" style={{ color: "#1C1917" }}>
            View Our Work
          </a>
        </div>

        {/* Trust strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs" style={{ color: "#A8A29E" }}>
          {["No lock-in contracts", "Results in 30 days", "50+ brands served"].map((t) => (
            <div key={t} className="trust-item flex items-center gap-2 opacity-0">
              <svg className="w-4 h-4" style={{ color: "#059669" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
