"use client";

import { WhatsAppIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function WhatsAppFloat() {
  return (
    <WhatsAppLink
      cta="floating"
      label="Chat with Sociolab on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 transition-transform hover:scale-105 active:scale-95"
    >
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-25" />
      <WhatsAppIcon className="relative size-7" />
    </WhatsAppLink>
  );
}