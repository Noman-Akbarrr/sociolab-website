"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/site";

export function ContactForm({
  message,
  buttonLabel = "Send on WhatsApp",
  subline,
  source = "website-contact",
}: {
  message: string;
  buttonLabel?: string;
  subline?: string;
  source?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      // Submit to CRM
      const res = await fetch("/admin/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: name.trim().split(" ")[0],
          lastName: name.trim().split(" ").slice(1).join(" ") || " ",
          email: email.trim(),
          phone: "",
          company: company.trim() || undefined,
          message: detail.trim(),
          source,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
    } catch (err) {
      console.error("CRM lead error:", err);
      // Don't block WhatsApp fallback
    } finally {
      setSubmitting(false);
    }
    // Open WhatsApp
    const text = [message, `Name: ${name.trim()}`, `Email: ${email.trim()}`, company.trim() ? `Company: ${company.trim()}` : "", detail.trim() ? `Details: ${detail.trim()}` : ""]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
    // Reset form
    setName("");
    setEmail("");
    setCompany("");
    setDetail("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        value={name}
        onChange={(e) => { setName(e.target.value); setError(""); }}
        placeholder="Your name"
        className="w-full rounded-[3px] border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-brand"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        placeholder="Your email"
        className="w-full rounded-[3px] border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-brand"
      />
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company (optional)"
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
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2.5 rounded-[3px] bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        <WhatsAppIcon className="size-5" />
        {submitting ? "Sending..." : buttonLabel}
      </button>
      {subline ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
          {subline}
        </p>
      ) : null}
    </form>
  );
}