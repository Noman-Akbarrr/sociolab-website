"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function CaseStudiesPage() {
  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Reveal>
          <div className="max-w-4xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Our Work
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
              Results That{" "}
              <span className="text-[#FF5500]">Speak</span>
            </h1>
            <p className="mt-7 max-w-[720px] mx-auto text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
              Real businesses, real results. See how we&apos;ve helped brands grow
              through performance marketing, social media, and web development.
            </p>
          </div>
        </Reveal>
      </Container>

      {/* ── Case Study List ─────────────────────────── */}
      <Section className="pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.06}>
              <CaseStudyCard cs={cs} />
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const [hovered, setHovered] = useState(false);
  const image = getCaseStudyImage(cs.slug);

  return (
    <FollowerPointerCard title={cs.client}>
      <Link href={`/case-studies/${cs.slug}`}>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
          className="group relative rounded-2xl overflow-hidden bg-white transition-all duration-500"
          style={{ cursor: "none", aspectRatio: "4/5" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={image}
            alt={cs.client}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          
          {/* Content container - handles the animation */}
          <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ease-out">
            {/* Brand name - always visible at bottom, moves up on hover */}
            <motion.h3
              className="text-base font-bold text-white drop-shadow-lg"
              initial={false}
              animate={{
                y: hovered ? -80 : 0,
                opacity: hovered ? 0 : 1,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {cs.client}
            </motion.h3>

            {/* Hover content - description + metrics - slides up from bottom */}
            <motion.div
              initial={false}
              animate={{
                y: hovered ? 0 : 60,
                opacity: hovered ? 1 : 0,
              }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 px-5"
            >
              <h3 className="text-base font-bold text-white mb-3 drop-shadow-lg">
                {cs.client}
              </h3>
              <motion.p
                initial={false}
                animate={{
                  y: hovered ? 0 : 10,
                  opacity: hovered ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm text-white/90 mb-4 line-clamp-3"
              >
                {cs.summary}
              </motion.p>
              <motion.div
                initial={false}
                animate={{
                  y: hovered ? 0 : 10,
                  opacity: hovered ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-2 text-xs"
              >
                {cs.results.slice(0, 2).map((r, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
                    <span className="font-semibold text-white">{r.value}</span>
                    <span className="text-white/70">{r.label}</span>
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </FollowerPointerCard>
  );
}

function getCaseStudyImage(slug: string): string {
  const images: Record<string, string> = {
    "exact-fashion-store": "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    "sehgal-motors": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
    "gcc-startups": "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    "tanzeem": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
  };
  return images[slug] || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop";
}