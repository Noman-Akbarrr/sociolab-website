import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/site";

const capabilities = [
  { label: "Performance Marketing", href: "/services/performance-marketing", icon: "bx bx-target-lock" },
  { label: "Social Media Management", href: "/services/social-media", icon: "bx bx-social-network" },
  { label: "Web Development", href: "/services/web-development", icon: "bx bx-code-alt" },
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
    <footer className="border-t border-[#1E293B] bg-[#070A10]">
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
            <p className="max-w-xs text-sm leading-relaxed text-[#94A3B8]">
              Full-service digital marketing agency helping brands grow through
              performance ads, social media, and high-converting websites.
            </p>
            <p className="text-xs text-[#94A3B8]">
              Islamabad / Rawalpindi, Pakistan — Serving Regional &amp; Global Clients.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400">
                Accepting New Clients
              </span>
            </div>
          </div>

          {/* ── Column 2: Services ─────────────────── */}
          <div>
            <p className="pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Services
            </p>
            <ul className="flex flex-col gap-3">
              {capabilities.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-[#94A3B8] transition-colors hover:text-white"
                  >
                    <i className={`${l.icon} text-sm text-[#FF5500]`} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Company ──────────────────── */}
          <div>
            <p className="pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#94A3B8] transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ──────────────────── */}
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Get in Touch
            </p>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#374151] bg-[#1F2937] px-4 py-2.5 text-sm font-semibold text-[#F9FAFB] transition-all hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.08)]"
            >
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              WhatsApp
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-[#94A3B8] transition-colors hover:text-white"
            >
              {site.email}
            </a>
            <p className="text-xs text-[#94A3B8]">
              Inquiries reviewed within 1 business day.
            </p>
          </div>
        </div>
      </Container>

      {/* ── Bottom Legal Bar ─────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#94A3B8]">
            &copy; 2026 {site.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-[#94A3B8] transition-colors hover:text-white"
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
