"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewPageForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = path.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed.startsWith("/")) {
      setError("Path must start with /");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: trimmed,
          title: "",
          description: "",
          data: { root: { props: { title: "", description: "" } }, content: [] },
        }),
      });
      if (res.ok) {
        router.push(`/admin/edit${trimmed === "/" ? "" : trimmed}`);
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
        className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
      >
        + New Page
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-[3px] border border-line bg-white px-3 focus-within:border-brand">
        <span className="font-mono text-sm text-ink/50">/</span>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="new-page-slug"
          autoFocus
          className="w-48 py-2.5 font-mono text-sm text-ink outline-none placeholder:text-ink/35"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create"}
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setPath(""); setError(""); }}
        className="rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand"
      >
        Cancel
      </button>
      {error && <span className="text-sm font-medium text-red-600">{error}</span>}
    </form>
  );
}
