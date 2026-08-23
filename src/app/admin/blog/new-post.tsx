"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(title);
    if (!slug) {
      setError("Give the post a title first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `/resources/${slug}`,
          title,
          description: "",
          data: {
            root: { props: { title, description: "" } },
            content: [
              {
                type: "TextBlock",
                props: {
                  align: "left",
                  paragraphs: [{ paragraph: "Start writing your post here — replace this with the real content." }],
                },
              },
              {
                type: "CtaBlock",
                props: {
                  title: "Want this applied to your brand?",
                  body: "",
                  tone: "orange",
                  ctaLabel: "Chat on WhatsApp",
                  whatsappMessage: "Hi Sociolab, I read your post and want to talk.",
                  subline: "",
                },
              },
            ],
          },
        }),
      });
      if (res.ok) {
        router.push(`/admin/edit/resources/${slug}`);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Couldn't create the post.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-[3px] border border-line bg-white p-5">
      <label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/50">
        New blog post
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title — e.g. 7 content ideas for restaurants"
          className="w-full flex-1 rounded-[3px] border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-[3px] bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create post"}
        </button>
      </div>
      <p className="font-mono text-xs text-ink/45">
        URL will be /resources/{slugify(title) || "your-post-slug"}
      </p>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </form>
  );
}