"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/site";

const CONSENT_COOKIE = "sociolab_consent";

export type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  const value = match.split("=")[1];
  return value === "granted" ? "granted" : "denied";
}

function setConsentCookie(value: Consent) {
  if (typeof document === "undefined") return;
  const maxAge = value === "granted" ? 31536000 : 90 * 86400;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function loadScript(src: string) {
  return new Promise<void>((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  dataLayer.push(args);
}

function initGtag() {
  if (!site.analytics.gaMeasurementId) return;
  window.gtag = window.gtag || ((...a: unknown[]) => gtag(...a));
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${site.analytics.gaMeasurementId}`);
}

function startClarity() {
  if (!site.analytics.clarityId || typeof window === "undefined") return;
  const s = document.createElement("script");
  s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${site.analytics.clarityId}");`;
  document.head.appendChild(s);
}

function startPlausible() {
  if (!site.analytics.plausibleUrl || !site.analytics.plausibleDomain || typeof window === "undefined") return;
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = site.analytics.plausibleDomain;
  s.src = `${site.analytics.plausibleUrl}/js/script.js`;
  document.head.appendChild(s);
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  const applyConsent = useCallback((value: Consent) => {
    if (!site.analytics.gaMeasurementId) return;
    if (value === "granted") {
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      startClarity();
    }
  }, []);

  useEffect(() => {
    if (!site.analytics.gaMeasurementId && !site.analytics.clarityId && !site.analytics.plausibleUrl) return;
    initGtag();
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    startPlausible(); // cookieless — loads without consent

    const saved = readConsent();
    setConsent(saved);
    if (saved === "granted") {
      applyConsent("granted");
    } else if (saved === "denied") {
      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }
  }, [applyConsent]);

  const accept = useCallback(() => {
    setConsentCookie("granted");
    applyConsent("granted");
    setConsent("granted");
    setBannerVisible(false);
  }, [applyConsent]);

  const reject = useCallback(() => {
    setConsentCookie("denied");
    setConsent("denied");
    setBannerVisible(false);
  }, []);

  return (
    <>
      {children}
      {bannerVisible && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-lg rounded-md border border-line bg-white p-5 shadow-2xl shadow-ink/15 sm:inset-x-auto sm:right-5 sm:bottom-5"
        >
          <p className="text-sm font-semibold text-ink">We value your privacy</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
            We use cookies and analytics (Google Analytics, Microsoft Clarity) to understand how
            visitors use our site and improve it. Accept to enable them, or reject — the site works
            either way.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={accept}
              className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={reject}
              className="rounded-[3px] border border-ink px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Reject
            </button>
            <a
              href="/legal/cookies"
              className="px-2 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Cookie policy
            </a>
          </div>
        </div>
      )}
    </>
  );
}