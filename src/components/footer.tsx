import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";

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
              <img
                src="/sociolab-header-logo.png"
                alt="Sociolab"
                className="h-28 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}>
              Full-service digital marketing agency helping brands grow through
              performance marketing, social media, and high-converting websites.
            </p>
            <p className="text-xs" style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}>
              Islamabad / Rawalpindi, Pakistan — Serving Regional & Global Clients.
            </p>
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
              href="tel:+923348366960"
              className="text-sm transition-colors hover:text-white"
              style={{ color: "#94A3B8", fontFamily: "var(--font-sans)" }}
            >
              +92 334 8366 960
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
