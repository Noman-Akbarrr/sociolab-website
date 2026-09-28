import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { whatsappHref } from "@/lib/site";

const capabilities = [
  { label: "Performance Marketing", href: "/services/performance-marketing" },
  { label: "Social Media Management", href: "/services/social-media" },
  { label: "Web Development", href: "/services/web-development" },
];

const company = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "About Us", href: "/about" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#070A10]" style={{ fontFamily: "var(--font-sans)" }}>
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* ── Column 1: Brand & Mission ──────────── */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} — home`}>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                {site.name}
                <span className="text-[#FF5500]">.</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}>
              Full-service digital marketing agency helping brands grow through
              performance marketing, social media, and high-converting websites.
            </p>
            <p className="text-xs" style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}>
              Islamabad / Rawalpindi, Pakistan — Serving Regional & Global Clients.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400" style={{ fontFamily: "var(--font-sans)" }}>
                Accepting Select Q3/Q4 Client Engagements
              </span>
            </div>
          </div>

          {/* ── Column 2: Capabilities ─────────────── */}
          <div>
            <p className="pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Capabilities
            </p>
            <ul className="flex flex-col gap-3">
              {capabilities.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Company & Evidence ───────── */}
          <div>
            <p className="pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact & Legal ──────────── */}
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Direct Contact
            </p>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#374151] bg-[#1F2937] px-4 py-2.5 text-sm font-semibold text-[#F9FAFB] transition-all hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.08)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <svg className="size-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.25 6.75c0 8.284-6.716 15-15 15-2.12 0-4.107-.577-5.772-1.58-.37-.198-.77-.27-1.178-.158a.75.75 0 01-.524-.931c.455-.455 1.129-.406 1.498-.07a17.079 17.079 0 006.426 6.426c.339.369.389.1002.07-.524a.75.75 0 01-.158-1.178c-.092-.202-.261-.389-.58-.577A14.983 14.983 0 016 8.25c0-8.284 6.716-15 15-15 2.636 0 5.054.77 7.113 2.121a.75.75 0 01.12.532c-.16.28-.23.601-.18.92-.395 2.413-.6 4.88-.6 7.378z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-sm transition-colors hover:text-white"
              style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}
            >
              {site.email}
            </a>
            <p className="text-xs" style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}>
              Inquiries reviewed within 1 business day.
            </p>
          </div>
        </div>
      </Container>

      {/* ── Bottom Legal Bar ─────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs" style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}>
            &copy; 2026 {site.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </footer>
  );
}
