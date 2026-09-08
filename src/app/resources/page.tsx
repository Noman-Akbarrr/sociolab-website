import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import { listPages } from "@/lib/pages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources — Trends, Tactics, and Growth Notes",
  description:
    "Practical thinking on trend-native content, WhatsApp marketing, and building brands that grow on purpose — from the Sociolab team.",
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
    <main className="bg-[#090D16] min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <Container className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Reveal>
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Resources
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Trends, tactics, and honest notes.
            </h1>
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              What&apos;s working, what&apos;s fading, and how to use both. Written by the team that
              ships this stuff daily — no recycled agency filler.
            </p>
          </div>
        </Reveal>
      </Container>

      {/* ── Posts Grid ──────────────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-16">
          {posts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.path} delay={i * 0.05}>
                  <Link
                    href={post.path}
                    className="group flex h-full flex-col justify-between gap-8 rounded-lg border border-[#1E293B] bg-[#111827] p-7 transition-all duration-200 hover:border-[#FF5500]/40"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                        <span className="accent-tint text-[10px]">Article</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "New"}</span>
                      </div>
                      <h2 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#FF5500]">
                        {post.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-[#94A3B8]">{post.description}</p>
                    </div>
                    <span className="flex items-center justify-between text-sm font-semibold text-[#CBD5E1]">
                      Read post
                      <ArrowUpRightIcon className="size-4 text-[#64748B] transition-all group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-[#94A3B8]">Posts coming soon.</p>
          )}
        </Container>
      </div>
    </main>
  );
}
