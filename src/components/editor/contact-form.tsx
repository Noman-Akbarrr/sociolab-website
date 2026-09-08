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
    } finally {
      setSubmitting(false);
    }
    const text = [message, `Name: ${name.trim()}`, `Email: ${email.trim()}`, company.trim() ? `Company: ${company.trim()}` : "", detail.trim() ? `Details: ${detail.trim()}` : ""]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
    setName("");
    setEmail("");
    setCompany("");
    setDetail("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" aria-label="Contact form">
      <div>
        <label htmlFor="contact-name" className="sr-only">Your name</label>
        <input
          id="contact-name"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder="Your name"
          required
          className="w-full rounded-lg border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#FF5500]"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="sr-only">Your email</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="Your email"
          required
          className="w-full rounded-lg border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#FF5500]"
        />
      </div>
      <div>
        <label htmlFor="contact-company" className="sr-only">Company (optional)</label>
        <input
          id="contact-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          className="w-full rounded-lg border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#FF5500]"
        />
      </div>
      <div>
        <label htmlFor="contact-detail" className="sr-only">Project details (optional)</label>
        <textarea
          id="contact-detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="What's your brand and what do you need? (optional)"
          rows={4}
          className="w-full resize-none rounded-lg border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#FF5500]"
        />
      </div>
      {error ? <span className="text-xs font-semibold text-red-400">{error}</span> : null}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#FF5500] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] disabled:opacity-50"
      >
        <WhatsAppIcon className="size-5" />
        {submitting ? "Sending..." : buttonLabel}
      </button>
      {subline ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
          {subline}
        </p>
      ) : null}
    </form>
  );
}
