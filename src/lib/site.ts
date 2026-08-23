export const site = {
  name: "Sociolab",
  domain: "sociolab.com.pk",
  url: "https://sociolab.com.pk",
  tagline: "Trend-native GTM team",
  // TODO: replace with the real WhatsApp business number (country code, no + or spaces)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+923001234567",
  whatsappDefaultMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Hi Sociolab, I want to grow my brand online.",
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+92 300 1234567",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@sociolab.com.pk",
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/",
    x: process.env.NEXT_PUBLIC_X_URL || "https://x.com/",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/",
  },
  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "",
    plausibleUrl: process.env.NEXT_PUBLIC_PLAUSIBLE_URL || "",
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  },
} as const;

export function whatsappHref(message?: string): string {
  const digits = site.whatsappNumber.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message ?? site.whatsappDefaultMessage);
  return `https://wa.me/${digits}?text=${text}`;
}