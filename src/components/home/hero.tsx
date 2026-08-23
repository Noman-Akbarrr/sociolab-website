import { Container } from "@/components/ui/container";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { Marquee } from "@/components/marquee";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-4xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            Sociolab — trend-native GTM team
          </p>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl md:text-7xl">
            The internet moves fast.
            <br />
            <span className="text-brand">Your brand should too.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
            We&apos;re the growth team for ambitious brands — producing content, running your
            social, marketing you, and building your web presence. One team, from trend to
            WhatsApp.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <WhatsAppLink
              cta="hero"
              className="inline-flex items-center gap-2.5 rounded-[3px] bg-brand px-7 py-4 text-base font-bold text-white transition-all hover:bg-brand-dark hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </WhatsAppLink>
            <a
              href="/work"
              className="inline-flex items-center gap-2 rounded-[3px] border-2 border-ink px-7 py-[14px] text-base font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              See our work
              <ArrowRightIcon className="size-4" />
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-8">
            {/* TODO: replace placeholder stats with real Sociolab numbers before launch */}
            <div>
              <dt className="sr-only">Brands grown</dt>
              <dd className="font-display text-3xl font-semibold text-ink sm:text-4xl">50+</dd>
              <dd className="mt-1 text-sm text-ink/60">brands grown</dd>
            </div>
            <div>
              <dt className="sr-only">Views generated</dt>
              <dd className="font-display text-3xl font-semibold text-ink sm:text-4xl">30M+</dd>
              <dd className="mt-1 text-sm text-ink/60">views generated</dd>
            </div>
            <div>
              <dt className="sr-only">In-house team</dt>
              <dd className="font-display text-3xl font-semibold text-ink sm:text-4xl">100%</dd>
              <dd className="mt-1 text-sm text-ink/60">in-house team</dd>
            </div>
          </dl>
        </div>
      </Container>

      {/* Signature orange ticker band */}
      <Marquee />
    </section>
  );
}