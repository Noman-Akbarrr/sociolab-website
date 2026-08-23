import { Container } from "@/components/ui/container";
import { Eyebrow, Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/whatsapp-link";

export type ServiceFaq = { q: string; a: string };

export type ServiceContent = {
  eyebrow: string;
  h1: string;
  heroSub: string;
  notFor: string;
  problemTitle: string;
  problemBody: string;
  steps: { title: string; body: string }[];
  deliverables: { title: string; items: string[] };
  expectationTitle: string;
  expectationBody: string;
  faqs: ServiceFaq[];
  ctaTitle: string;
  ctaBody: string;
  proofTitle: string;
  proofBody: string;
};

export function ServicePage({ content, whatsappMessage }: { content: ServiceContent; whatsappMessage: string }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {content.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">{content.heroSub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppLink
              cta="service-hero"
              message={whatsappMessage}
              className="inline-flex items-center gap-2.5 rounded-[3px] bg-brand px-7 py-4 text-base font-bold text-white transition-colors hover:bg-brand-dark"
            >
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </WhatsAppLink>
            <a
              href="/method"
              className="inline-flex items-center gap-2 rounded-[3px] border-2 border-ink px-7 py-[14px] text-base font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              See how we work
            </a>
          </div>
        </Container>
      </section>

      {/* Not for you */}
      <section className="bg-mist">
        <Container className="py-10">
          <p className="max-w-3xl font-mono text-sm font-medium leading-relaxed text-ink/75">
            <span className="font-bold text-brand">Not for you?</span> {content.notFor}
          </p>
        </Container>
      </section>

      {/* Problem */}
      <Section>
        <div className="max-w-3xl">
          <Eyebrow>Sound familiar?</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {content.problemTitle}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">{content.problemBody}</p>
        </div>
      </Section>

      {/* Process */}
      <Section className="bg-mist">
        <div className="max-w-3xl">
          <Eyebrow>How we fix it</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            The process, in plain English
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {content.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <li className="flex h-full flex-col gap-3 rounded-[3px] border border-line bg-white p-7">
                <span className="font-display text-2xl font-semibold text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink/65">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* What's included */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="max-w-xl">
            <Eyebrow>What&apos;s included</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {content.deliverables.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">{content.expectationBody}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.deliverables.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[3px] border border-line bg-white px-5 py-4"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="text-sm font-medium text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Expectation setting */}
      <Section className="bg-ink text-white">
        <div className="max-w-3xl">
          <Eyebrow>{content.expectationTitle}</Eyebrow>
          <p className="mt-6 text-xl leading-relaxed text-white/80">{content.expectationBody}</p>
        </div>
      </Section>

      {/* Proof */}
      <Section>
        <Eyebrow>Receipts</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {content.proofTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">{content.proofBody}</p>
        <a
          href="/work"
          className="mt-7 inline-flex items-center gap-2 rounded-[3px] border-2 border-ink px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          See full case studies
        </a>
      </Section>

      {/* FAQ */}
      <Section className="bg-mist">
        <div className="max-w-3xl">
          <Eyebrow>Straight answers</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Questions before you reach out
          </h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {content.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base font-semibold text-ink">
                  {faq.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/30 text-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-2 pt-3 text-sm leading-relaxed text-ink/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-brand">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {content.ctaTitle}
            </h2>
            <p className="text-lg text-white/85">{content.ctaBody}</p>
            <WhatsAppLink
              cta="service-final"
              message={whatsappMessage}
              className="mt-2 inline-flex items-center gap-2.5 rounded-[3px] bg-ink px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </WhatsAppLink>
          </div>
        </Container>
      </section>
    </>
  );
}