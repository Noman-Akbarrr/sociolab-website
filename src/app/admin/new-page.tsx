"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewPageForm() {
  const router = useRouter();
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = path.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed.startsWith("/")) {
      setError("Path must start with a / — e.g. /industries/restaurants");
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
        router.refresh();
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

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 rounded-[3px] border border-line bg-white p-5 sm:flex-row">
      <div className="flex flex-1 items-center gap-2 rounded-[3px] border border-line bg-white px-3 focus-within:border-brand">
        <span className="font-mono text-sm text-ink/50">/</span>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="new-page-slug"
          className="w-full py-3 font-mono text-sm text-ink outline-none placeholder:text-ink/35"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-[3px] bg-ink px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create new page"}
      </button>
      {error ? <p className="w-full text-sm font-medium text-red-600 sm:w-auto">{error}</p> : null}
    </form>
  );
}