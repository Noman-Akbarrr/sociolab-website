"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CloseIcon, MenuIcon, WhatsAppIcon, ArrowUpRightIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/whatsapp-link";

const services = [
  {
    title: "Social Media Management",
    href: "/services/social-media-management",
    blurb: "Content that trends, communities that engage, a feed that sells.",
  },
  {
    title: "Digital Marketing",
    href: "/services/digital-marketing",
    blurb: "Ads, SEO, and campaigns that turn attention into customers.",
  },
  {
    title: "Web Development",
    href: "/services/web-development",
    blurb: "Fast, beautiful, conversion-built websites that make you credible.",
  },
];

const nav = [
  { label: "About", href: "/about" },
  { label: "Method", href: "/method" },
  { label: "Work", href: "/work" },
];

export type NavPost = {
  path: string;
  title: string;
  updatedAt: string;
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
      <span className="grid size-9 place-items-center rounded-[4px] bg-brand font-display text-base font-bold text-white">
        S
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        {site.name}
      </span>
    </Link>
  );
}

export function Navbar({ posts = [] }: { posts?: NavPost[] }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
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
    setServicesOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-line bg-white/90 backdrop-blur-md" : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                pathname.startsWith("/services") ? "text-brand" : "text-ink hover:text-brand"
              }`}
            >
              Services
              <svg
                viewBox="0 0 24 24"
                className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-4">
                <div className="rounded-md border border-line bg-white p-3 shadow-2xl shadow-ink/10">
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="group flex flex-col gap-1 rounded-[3px] px-4 py-3 transition-colors hover:bg-mist"
                    >
                      <span
                        className={`text-sm font-bold ${
                          isActive(s.href) ? "text-brand" : "text-ink group-hover:text-brand"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="text-xs text-ink/60">{s.blurb}</span>
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
              className={`text-sm font-semibold transition-colors ${
                isActive(item.href) ? "text-brand" : "text-ink hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Resources dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              aria-expanded={resourcesOpen}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                pathname.startsWith("/resources") ? "text-brand" : "text-ink hover:text-brand"
              }`}
            >
              Resources
              <svg
                viewBox="0 0 24 24"
                className={`size-3.5 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {resourcesOpen && (
              <div className="absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-4">
                <div className="rounded-md border border-line bg-white p-3 shadow-2xl shadow-ink/10">
                  <Link
                    href="/resources"
                    className="group flex items-center justify-between rounded-[3px] px-4 py-3 transition-colors hover:bg-mist"
                  >
                    <span className="text-sm font-bold text-ink group-hover:text-brand">
                      All resources
                    </span>
                    <ArrowUpRightIcon className="size-4 text-ink/40 transition-all group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <div className="mx-4 mb-1 mt-1 h-px bg-line" />
                  <p className="px-4 pb-1 pt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                    Latest posts
                  </p>
                  {posts.length ? (
                    posts.map((p) => (
                      <Link
                        key={p.path}
                        href={p.path}
                        className="group flex flex-col gap-0.5 rounded-[3px] px-4 py-2.5 transition-colors hover:bg-mist"
                      >
                        <span className="text-sm font-semibold text-ink group-hover:text-brand">
                          {p.title}
                        </span>
                        <span className="text-xs text-ink/55">
                          {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "New"}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-ink/55">Posts coming soon.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:block">
          <WhatsAppLink
            cta="nav"
            className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            <WhatsAppIcon className="size-4" />
            Chat on WhatsApp
          </WhatsAppLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-[3px] text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-4 sm:px-8" aria-label="Mobile">
            <p className="px-1 pb-2 pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-[3px] px-1 py-2.5 text-base font-semibold text-ink"
              >
                {s.title}
              </Link>
            ))}
<p className="px-1 pb-2 pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              Resources
            </p>
            <Link
              href="/resources"
              className="flex items-center justify-between rounded-[3px] px-1 py-2.5 text-base font-semibold text-ink"
            >
              All resources
              <ArrowUpRightIcon className="size-4 text-ink/40" />
            </Link>
            {posts.map((p) => (
              <Link
                key={p.path}
                href={p.path}
                className="rounded-[3px] px-1 py-2.5 text-base font-semibold text-ink"
              >
                {p.title}
              </Link>
            ))}
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[3px] px-1 py-2.5 text-base font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            <WhatsAppLink
              cta="nav-mobile"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-[3px] bg-brand px-5 py-3.5 text-sm font-bold text-white"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </WhatsAppLink>
          </nav>
        </div>
      )}
    </header>
  );
}