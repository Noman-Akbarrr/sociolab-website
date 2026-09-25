import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { listPages } from "@/lib/pages";
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
  const pages = await listPages();
  const posts = pages
    .filter((p) => p.path.startsWith("/resources/") && p.published)
    .sort((a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""))
    .reverse();

  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Reveal>
          <div className="max-w-4xl">
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
        </Reveal>
      </Container>

      {/* ── Posts Grid ──────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E7E5E4" }}>
        <Container className="py-16">
          {posts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.path} delay={i * 0.05}>
                  <Link href={post.path}>
                    <div className="group flex h-full flex-col justify-between gap-8 rounded-xl border border-stone-200 bg-white p-7 transition-all duration-200 hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-1">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#78716C" }}>
                          <span className="text-[10px] font-semibold text-[#FF5500]">Article</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "New"}</span>
                        </div>
                        <h2 className="text-lg font-bold leading-snug transition-colors group-hover:text-[#FF5500]" style={{ color: "#1C1917" }}>
                          {post.title}
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>{post.description}</p>
                      </div>
                      <span className="flex items-center justify-between text-sm font-semibold" style={{ color: "#44403C" }}>
                        Read post
                        <svg className="w-4 h-4 transition-all group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "#A8A29E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p style={{ color: "#78716C" }}>Posts coming soon.</p>
          )}
        </Container>
      </div>
    </main>
  );
}
