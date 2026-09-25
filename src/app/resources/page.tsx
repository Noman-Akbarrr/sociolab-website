import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources — Digital Marketing Tips & Growth Notes",
  description:
    "Practical thinking on performance marketing, social media, and building brands that grow — from the Sociolab team.",
  alternates: {
    canonical: `${site.url}/resources`,
  },
};

export const revalidate = 60;

export default async function ResourcesPage() {
  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
          Resources
        </p>
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl" style={{ color: "#1C1917" }}>
          Trends, tactics, and honest notes.
        </h1>
        <p className="mt-7 max-w-[720px] text-lg leading-relaxed sm:text-xl" style={{ color: "#57534E" }}>
          What&apos;s working, what&apos;s fading, and how to use both. Written by the team that
          ships this stuff daily — no recycled agency filler.
        </p>
      </div>

      <div style={{ borderTop: "1px solid #E7E5E4" }}>
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-16">
          <p style={{ color: "#78716C" }}>Posts coming soon.</p>
        </div>
      </div>
    </main>
  );
}
