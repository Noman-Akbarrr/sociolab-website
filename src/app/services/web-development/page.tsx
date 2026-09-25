"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Custom Websites",
    description:
      "Bespoke websites built from scratch — no templates. Designed and coded to reflect your brand and convert visitors.",
    details: [
      "Custom UI/UX design",
      "Next.js / React development",
      "CMS integration",
      "Mobile-first responsive design",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: "Landing Pages",
    description:
      "High-converting landing pages for your ad campaigns — built to maximize the ROI of every click you pay for.",
    details: [
      "Conversion-optimized design",
      "A/B testing ready",
      "Fast load times",
      "Analytics & tracking setup",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "E-Commerce Development",
    description:
      "Custom e-commerce experiences that turn browsers into buyers — Shopify, WooCommerce, or custom-built.",
    details: [
      "Shopify theme customization",
      "Product page optimization",
      "Checkout flow design",
      "Payment gateway integration",
    ],
  },
];

const techStack = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "UI Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Prisma", category: "Database ORM" },
  { name: "Vercel", category: "Hosting" },
];

export default function WebDevelopmentPage() {
  const techRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (techRef.current) {
      const items = techRef.current.querySelectorAll(".tech-item");
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.4, stagger: 0.08,
          scrollTrigger: { trigger: techRef.current, start: "top 85%" }
        }
      );
    }
  }, []);

  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Web Development
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
              Websites That{" "}
              <span className="text-[#FF5500]">Convert</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
              Custom-built websites, landing pages, and e-commerce stores designed
              to turn visitors into customers — fast, beautiful, and built to scale.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get a Free Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-7 py-4 text-[15px] font-semibold transition-all duration-200 hover:bg-stone-50"
                style={{ color: "#1C1917" }}
              >
                View Our Work
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── Services ────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              What We Build
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Custom Web Solutions
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                className="flex flex-col gap-4 p-6 rounded-xl bg-white border border-stone-200"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74", color: "#FF5500" }}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#1C1917" }}>{service.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "#57534E" }}>
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2 mt-auto pt-4" style={{ borderTop: "1px solid #E7E5E4" }}>
                  {service.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                      <span className="text-sm" style={{ color: "#44403C" }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Tech Stack ──────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Tech Stack
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Modern, Fast, Scalable
            </h2>
          </div>
        </Reveal>

        <div ref={techRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {techStack.map((t) => (
            <div key={t.name} className="tech-item p-6 rounded-xl bg-white border border-stone-200">
              <h4 className="font-bold text-lg" style={{ color: "#1C1917" }}>{t.name}</h4>
              <p className="text-sm mt-1" style={{ color: "#78716C" }}>{t.category}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E7E5E4" }}>
        <Container className="py-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-[1.1]" style={{ color: "#1C1917" }}>
              Ready to Build Something Great?
            </h2>
            <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "#57534E" }}>
              Tell us about your project. We&apos;ll give you a free estimate and
              timeline — no strings attached.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5500] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E04B00] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
              >
                Get a Free Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </Reveal>
        </Container>
      </div>
    </main>
  );
}
