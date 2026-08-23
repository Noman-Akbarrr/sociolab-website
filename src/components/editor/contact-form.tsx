"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/site";

export function ContactForm({
  message,
  buttonLabel = "Send on WhatsApp",
  subline,
}: {
  message: string;
  buttonLabel?: string;
  subline?: string;
}) {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tell us your name.");
      return;
    }
    const text = [message, `Name: ${name.trim()}`, detail.trim() ? `Details: ${detail.trim()}` : ""]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
        placeholder="Your name"
        className="w-full rounded-[3px] border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-brand"
      />
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="What's your brand and what do you need? (optional)"
        rows={4}
        className="w-full resize-none rounded-[3px] border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-brand"
      />
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2.5 rounded-[3px] bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
      >
        <WhatsAppIcon className="size-5" />
        {buttonLabel}
      </button>
      {subline ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
          {subline}
        </p>
      ) : null}
    </form>
  );
}