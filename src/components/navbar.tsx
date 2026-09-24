"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/whatsapp-link";

const capabilities = [
  {
    title: "Performance Marketing",
    href: "/services/performance-marketing",
    blurb: "Meta & Google ads that drive real results.",
    icon: "bx bx-target-lock",
  },
  {
    title: "Social Media Management",
    href: "/services/social-media",
    blurb: "Content, community, and growth across platforms.",
    icon: "bx bx-social-network",
  },
  {
    title: "Web Development",
    href: "/services/web-development",
    blurb: "Websites and landing pages that convert.",
    icon: "bx bx-code-alt",
  },
];

const nav = [
  { label: "Work", href: "/case-studies" },
  { label: "About", href: "/about" },
];

export type NavPost = {
  path: string;
  title: string;
  updatedAt: string;
};

export function Navbar({ posts = [] }: { posts?: NavPost[] }) {
  const [open, setOpen] = useState(false);
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setCapabilitiesOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? "border-[#1E293B] bg-[#090D16]/80 backdrop-blur-md"
          : "border-transparent bg-[#090D16]/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* ── Wordmark ─────────────────────────────── */}
        <Link href="/" className="flex items-center" aria-label={`${site.name} — home`}>
          <img
            src="/sociolab-logo.jpg"
            alt="Sociolab"
            className="h-8 w-auto rounded"
          />
        </Link>

        {/* ── Desktop nav ──────────────────────────── */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCapabilitiesOpen(true)}
            onMouseLeave={() => setCapabilitiesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCapabilitiesOpen((v) => !v)}
              aria-expanded={capabilitiesOpen}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/services")
                  ? "text-[#FF5500]"
                  : "text-[#CBD5E1] hover:text-white"
              }`}
            >
              Services
              <svg
                viewBox="0 0 24 24"
                className={`size-3 transition-transform ${capabilitiesOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {capabilitiesOpen && (
              <div className="absolute left-1/2 top-full w-[440px] -translate-x-1/2 pt-3">
                <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-2 shadow-2xl shadow-black/40">
                  {capabilities.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-[#1E293B]/50"
                    >
                      <i
                        className={`${c.icon} text-lg ${
                          isActive(c.href) ? "text-[#FF5500]" : "text-[#94A3B8] group-hover:text-[#FF5500]"
                        }`}
                      />
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-sm font-semibold ${
                            isActive(c.href)
                              ? "text-[#FF5500]"
                              : "text-white group-hover:text-[#FF5500]"
                          }`}
                        >
                          {c.title}
                        </span>
                        <span className="text-xs text-[#94A3B8]">{c.blurb}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-[#FF5500]"
                  : "text-[#CBD5E1] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTAs ─────────────────────────── */}
        <div className="hidden items-center gap-4 lg:flex">
          <WhatsAppLink
            cta="nav"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#CBD5E1] transition-colors hover:text-white"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            Direct Chat
          </WhatsAppLink>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF5500] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5500]"
          >
            Get Free Audit
          </Link>
        </div>

        {/* ── Mobile menu toggle ───────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────── */}
      {open && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-[#090D16] lg:hidden">
          <nav className="flex-1 overflow-y-auto px-5 py-6 sm:px-8" aria-label="Mobile">
            {/* Services section */}
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Services
            </p>
            {capabilities.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center gap-3 border-b border-[#1E293B] py-3.5 text-base font-semibold text-white last:border-b-0"
              >
                <i className={`${c.icon} text-lg text-[#FF5500]`} />
                <div className="flex flex-col gap-0.5">
                  {c.title}
                  <span className="text-xs font-normal text-[#94A3B8]">{c.blurb}</span>
                </div>
              </Link>
            ))}

            {/* Other links */}
            <p className="mb-3 mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5500]">
              Company
            </p>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-b border-[#1E293B] py-3.5 text-base font-semibold text-white last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom action row */}
          <div className="border-t border-[#1E293B] px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-3">
              <WhatsAppLink
                cta="nav-mobile"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#374151] bg-[#1F2937] px-5 py-3 text-sm font-semibold text-[#F9FAFB] transition-all hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.08)]"
              >
                <WhatsAppIcon className="size-5 text-[#25D366]" />
                Chat on WhatsApp
              </WhatsAppLink>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#E04B00]"
              >
                Get Free Audit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
