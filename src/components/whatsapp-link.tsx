"use client";

import { whatsappHref } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackWhatsApp(cta: string) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "whatsapp_click", {
      cta,
      page: window.location.pathname,
    });
  } catch {
    // analytics must never break the click
  }
}

export function WhatsAppLink({
  message,
  cta = "whatsapp",
  children,
  className,
  label,
  style,
}: {
  message?: string;
  cta?: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(cta)}
      aria-label={label}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}