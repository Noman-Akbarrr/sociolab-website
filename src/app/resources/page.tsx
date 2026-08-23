import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ArrowUpRightIcon } from "@/components/icons";
import { listPages } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Resources — Trends, Tactics, and Growth Notes",
  description:
    "Practical thinking on trend-native content, WhatsApp marketing, and building brands that grow on purpose — from the Sociolab team.",
};

export const revalidate = 60;

export default async function ResourcesPage() {
  const pages = await listPages();
  const posts = pages
    .filter((p) => p.path.startsWith("/resources/") && p.published)
    .sort((a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""))
    .reverse();

  return (
    <>
      <section className="bg-white">
        <Container className="pt-16 pb-16 sm:pt-24 sm:pb-24">
          <Eyebrow>Resources</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Trends, tactics, and honest notes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            What&apos;s working, what&apos;s fading, and how to use both. Written by the team that
            ships this stuff daily — no recycled agency filler.
          </p>
        </Container>
      </section>

      <section className="bg-mist">
        <Container className="py-16">
          {posts.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.path} delay={i * 0.05}>
                  <Link
                    href={post.path}
                    className="group flex h-full flex-col justify-between gap-8 rounded-[3px] border border-line bg-white p-7 transition-colors hover:border-brand"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50">
                        <span className="text-brand">Article</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "New"}</span>
                      </div>
                      <h2 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
                        {post.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-ink/65">{post.description}</p>
                    </div>
                    <span className="flex items-center justify-between text-sm font-bold text-ink">
                      Read post
                      <ArrowUpRightIcon className="size-4 text-ink/40 transition-all group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-ink/60">Posts coming soon.</p>
          )}
        </Container>
      </section>
    </>
  );
}