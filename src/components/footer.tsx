import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { whatsappHref } from "@/lib/site";

const serviceLinks = [
  { label: "Social Media Management", href: "/services/social-media-management" },
  { label: "Digital Marketing", href: "/services/digital-marketing" },
  { label: "Web Development", href: "/services/web-development" },
];

const siteLinks = [
  { label: "About", href: "/about" },
  { label: "Method", href: "/method" },
  { label: "Work", href: "/work" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
              <span className="grid size-9 place-items-center rounded-[4px] bg-brand font-display text-base font-bold text-white">
                S
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                {site.name}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              A trend-native GTM team for ambitious brands. Social, marketing, and web — one team,
              from trend to WhatsApp.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
                { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
                { label: "X", href: site.socials.x, Icon: XIcon },
                { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedInIcon },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-[4px] border border-white/15 text-white/70 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-bright">
              Services
            </p>
            <ul className="flex flex-col gap-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-bright">
              Site
            </p>
            <ul className="flex flex-col gap-3">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-bright">
              Talk to us
            </p>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-[3px] bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
            <a href={`mailto:${site.email}`} className="text-sm text-white/70 hover:text-white">
              {site.email}
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white">
              We reply fast — usually within the hour.
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}