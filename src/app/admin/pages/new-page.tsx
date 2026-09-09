"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewPageForm({ group, prefix }: { group: string; prefix: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed) {
      setError("Slug is required.");
      return;
    }
    const fullPath = prefix ? `${prefix}${trimmed}` : `/${trimmed}`;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: fullPath,
          title: "",
          description: "",
          data: { root: { props: { title: "", description: "" } }, content: [] },
        }),
      });
      if (res.ok) {
        router.push(`/admin/edit${fullPath === "/" ? "" : fullPath}`);
      } else {
        const data = await res.json();
        setError(data.error ?? "Couldn't create the page.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-[3px] bg-[#FF5500] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#E04B00]"
      >
        <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 focus-within:border-[#FF5500]">
        {prefix && <span className="font-mono text-xs text-white/40">{prefix}</span>}
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={group === "core" ? "new-page-slug" : "page-slug"}
          autoFocus
          className="w-40 py-2 font-mono text-xs text-white outline-none placeholder:text-white/35"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-[3px] bg-[#FF5500] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#E04B00] disabled:opacity-60"
      >
        {loading ? "..." : "Create"}
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setSlug(""); setError(""); }}
        className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-bold text-white/70 transition-colors hover:border-[#FF5500]"
      >
        Cancel
      </button>
      {error && <span className="text-xs font-medium text-red-400">{error}</span>}
    </form>
  );
}
