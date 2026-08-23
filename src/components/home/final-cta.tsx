import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { WhatsAppIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function FinalCta() {
  return (
    <Section className="bg-brand py-20 sm:py-28">
      <Reveal>
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            Let&apos;s make your brand the one they talk about.
          </h2>
          <p className="text-lg font-medium text-white/85">
            No forms. No booking tools. Just a conversation.
          </p>
          <WhatsAppLink
            cta="final"
            className="mt-2 inline-flex items-center gap-2.5 rounded-[3px] bg-ink px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            Chat on WhatsApp
          </WhatsAppLink>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            We reply fast — usually within the hour
          </p>
        </div>
      </Reveal>
    </Section>
  );
}