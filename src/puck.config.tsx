import type { Config } from "@puckeditor/core";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { Marquee } from "@/components/marquee";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ArrowUpRightIcon, CheckIcon, WhatsAppIcon } from "@/components/icons";
import { ContactForm } from "@/components/editor/contact-form";
import { CRMCaseGrid } from "@/components/editor/crm-case-grid";
import { CRMTeamBlock } from "@/components/editor/crm-team-block";
import { CRMServiceGrid } from "@/components/editor/crm-service-grid";
import { CRMPricingBlock } from "@/components/editor/crm-pricing-block";
import { CRMTestimonialBlock } from "@/components/editor/crm-testimonial-block";

type BlockProps = {
  HeroBlock: Record<string, any>;
  MarqueeBlock: Record<string, any>;
  SectionBlock: Record<string, any>;
  CardGridBlock: Record<string, any>;
  ServiceGridBlock: Record<string, any>;
  CRMServiceGrid: Record<string, any>;
  StepsBlock: Record<string, any>;
  CaseGridBlock: Record<string, any>;
  CRMCaseGrid: Record<string, any>;
  TestimonialBlock: Record<string, any>;
  CRMTestimonialBlock: Record<string, any>;
  FaqBlock: Record<string, any>;
  CtaBlock: Record<string, any>;
  StatementBlock: Record<string, any>;
  CalloutBlock: Record<string, any>;
  TextBlock: Record<string, any>;
  DeliverablesBlock: Record<string, any>;
  ImageBlock: Record<string, any>;
  TwoColumnBlock: Record<string, any>;
  LinkBlock: Record<string, any>;
  StatsBlock: Record<string, any>;
  FeaturesBlock: Record<string, any>;
  PricingBlock: Record<string, any>;
  CRMPricingBlock: Record<string, any>;
  TeamBlock: Record<string, any>;
  CRMTeamBlock: Record<string, any>;
  GalleryBlock: Record<string, any>;
  ContactFormBlock: Record<string, any>;
  VideoBlock: Record<string, any>;
  BlogHeroBlock: Record<string, any>;
  QuoteBlock: Record<string, any>;
  AuthorBlock: Record<string, any>;
  TagsBlock: Record<string, any>;
};

function videoEmbed(src: string) {
  const youtube = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (youtube) {
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  }
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }
  return null;
}

const config: Config<BlockProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Page title (SEO)" },
      description: { type: "textarea", label: "Page description (SEO)" },
    },
    render: ({ children }) => <>{children}</>,
  },

  categories: {
    heroes: { title: "Heroes & openers", components: ["HeroBlock"] },
    blog: { title: "Blog sections", components: ["BlogHeroBlock", "QuoteBlock", "AuthorBlock", "TagsBlock"] },
    sections: { title: "Page sections", components: ["SectionBlock", "TextBlock", "StepsBlock", "DeliverablesBlock", "CardGridBlock", "FeaturesBlock", "StatsBlock", "CaseGridBlock", "CRMCaseGrid", "TestimonialBlock", "CRMTestimonialBlock", "FaqBlock", "MarqueeBlock"] },
    media: { title: "Media & layouts", components: ["ImageBlock", "GalleryBlock", "VideoBlock", "TwoColumnBlock", "TeamBlock", "CRMTeamBlock"] },
    conversion: { title: "Conversion & CTAs", components: ["CtaBlock", "ContactFormBlock", "PricingBlock", "CRMPricingBlock", "CalloutBlock", "StatementBlock", "ServiceGridBlock", "CRMServiceGrid", "LinkBlock"] },
  },

  components: {
    HeroBlock: {
      label: "Hero",
      fields: {
        variant: { type: "radio", options: [
          { value: "solid", label: "Solid background" },
          { value: "image", label: "Image background" },
        ] },
        backgroundImage: { type: "image" } as any,
        badge: { type: "text" },
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        accentTitle: { type: "text" },
        sub: { type: "textarea" },
        align: { type: "radio", options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ] },
        ctaLabel: { type: "text" },
        whatsappMessage: { type: "textarea" },
        ctaStyle: { type: "radio", options: [
          { value: "solid", label: "Solid" },
          { value: "outline", label: "Outline" },
        ] },
        ctaColor: { type: "color" } as any,
        ctaSize: { type: "radio", options: [
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
        ] },
        secondaryLabel: { type: "text" },
        secondaryHref: { type: "text" },
        stats: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" },
          },
        },
      },
      defaultProps: {
        variant: "solid",
        backgroundImage: "",
        badge: "",
        eyebrow: "Sociolab — trend-native GTM team",
        title: "The internet moves fast.\nYour brand should too.",
        accentTitle: "",
        sub: "We're the growth team for ambitious brands — producing content, running your social, marketing you, and building your web presence. One team, from trend to WhatsApp.",
        align: "left",
        ctaLabel: "Chat on WhatsApp",
        whatsappMessage: "Hi Sociolab, I want to grow my brand online.",
        ctaStyle: "solid",
        ctaColor: "#ff4d00",
        ctaSize: "md",
        secondaryLabel: "See our work",
        secondaryHref: "/work",
        stats: [
          { value: "50+", label: "brands grown" },
          { value: "30M+", label: "views generated" },
          { value: "100%", label: "in-house team" },
        ],
      },
      render: ({
        variant,
        backgroundImage,
        badge,
        eyebrow,
        title,
        accentTitle,
        sub,
        align,
        ctaLabel,
        whatsappMessage,
        ctaStyle,
        ctaColor,
        ctaSize,
        secondaryLabel,
        secondaryHref,
        stats = [],
      }) => {
        const imageMode = variant === "image" && backgroundImage;
        const color = ctaColor || "#ff4d00";
        const lightColor = /^#(f[0-9a-f]{5}|f{6}|e[0-9a-f]{5})$/i.test(color);
        const sizeCls =
          ctaSize === "lg"
            ? "px-9 py-5 text-lg"
            : ctaSize === "sm"
              ? "px-5 py-2.5 text-sm"
              : "px-7 py-4 text-base";
        const alignCls =
          align === "center"
            ? "mx-auto flex flex-col items-center text-center"
            : align === "right"
              ? "ml-auto flex flex-col items-end text-right"
              : "flex flex-col items-start text-left";
        return (
          <section className="relative overflow-hidden">
            {imageMode ? (
              <>
                <div className="absolute inset-0">
                  <Image
                    src={backgroundImage}
                    alt=""
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div className="absolute inset-0 bg-ink/80" />
              </>
            ) : null}
            <Container className={`pt-16 pb-20 sm:pt-24 sm:pb-28 ${imageMode ? "relative" : ""}`}>
              <div className={`max-w-4xl ${alignCls}`}>
                {badge ? (
                  <span className="inline-block rounded-full border border-brand px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                    {badge}
                  </span>
                ) : null}
                {eyebrow ? (
                  <p
                    className={`mt-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] ${
                      imageMode ? "text-brand-bright" : "text-brand"
                    }`}
                  >
                    {eyebrow}
                  </p>
                ) : null}
                <h1
                  className={`mt-6 whitespace-pre-line font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl md:text-7xl ${
                    imageMode ? "text-white" : "text-ink"
                  }`}
                >
                  {title}
                  {accentTitle ? <span className="block text-brand-bright">{accentTitle}</span> : null}
                </h1>
                {sub ? (
                  <p
                    className={`mt-7 max-w-2xl whitespace-pre-line text-lg leading-relaxed sm:text-xl ${
                      imageMode ? "text-white/85" : "text-ink/70"
                    }`}
                  >
                    {sub}
                  </p>
                ) : null}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <WhatsAppLink
                    cta="hero"
                    message={whatsappMessage}
                    className={`inline-flex items-center gap-2.5 rounded-[3px] font-bold transition-all hover:-translate-y-[1px] active:translate-y-[1px] ${sizeCls} ${
                      ctaStyle === "outline"
                        ? "border-2 border-[var(--cta)] text-[var(--cta)] hover:bg-[var(--cta)] hover:text-white"
                        : `bg-[var(--cta)] ${lightColor ? "text-ink" : "text-white"} hover:bg-[color-mix(in_srgb,var(--cta),#000_14%)]`
                    }`}
                    style={{ "--cta": color } as React.CSSProperties}
                  >
                    <WhatsAppIcon className="size-5" />
                    {ctaLabel || "Chat on WhatsApp"}
                  </WhatsAppLink>
                  {secondaryLabel && secondaryHref ? (
                    <Link
                      href={secondaryHref}
                      className={`inline-flex items-center gap-2 rounded-[3px] border-2 px-7 py-[14px] text-base font-bold transition-colors ${
                        imageMode
                          ? "border-white/60 text-white hover:bg-white hover:text-ink"
                          : "border-ink text-ink hover:bg-ink hover:text-white"
                      }`}
                    >
                      {secondaryLabel}
                      <ArrowUpRightIcon className="size-4" />
                    </Link>
                  ) : null}
                </div>
                {stats.length ? (
                  <dl
                    className={`mt-14 grid max-w-xl grid-cols-3 gap-6 border-t pt-8 ${
                      imageMode ? "border-white/25" : "border-line"
                    }`}
                  >
                    {stats.map((stat: any, i: number) => (
                      <div key={i}>
                        <dt className="sr-only">{stat.label}</dt>
                        <dd
                          className={`font-display text-3xl font-semibold sm:text-4xl ${
                            imageMode ? "text-white" : "text-ink"
                          }`}
                        >
                          {stat.value}
                        </dd>
                        <dd className={`mt-1 text-sm ${imageMode ? "text-white/70" : "text-ink/60"}`}>
                          {stat.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </Container>
          </section>
        );
      },
    },

    /* ----------------------------- Marquee band -------------------------- */
    MarqueeBlock: {
      label: "Marquee band",
      fields: {
        items: {
          type: "array",
          arrayFields: { item: { type: "text" } },
        },
      },
      defaultProps: {
        items: [],
      },
      render: ({ items = [] }) => <Marquee items={items.map((i: any) => i.item)} />,
    },

    /* ------------------------- Section heading --------------------------- */
    SectionBlock: {
      label: "Section heading",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        dark: { type: "radio", options: [
          { value: "false", label: "Light" },
          { value: "true", label: "Dark" },
        ] },
        align: { type: "radio", options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ] },
      },
      defaultProps: {
        eyebrow: "",
        title: "Section title",
        subtitle: "",
        dark: "false",
        align: "left",
      },
      render: ({ eyebrow, title, subtitle, dark, align }) => (
        <Section className={dark === "true" ? "bg-ink text-white" : "bg-white"}>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            dark={dark === "true"}
            align={align === "center" ? "center" : "left"}
          />
        </Section>
      ),
    },

    /* --------------------------- Card grid ------------------------------- */
    CardGridBlock: {
      label: "Card grid",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        tone: { type: "radio", options: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ] },
        numbered: { type: "radio", options: [
          { value: "false", label: "No numbers" },
          { value: "true", label: "Show numbers" },
        ] },
        columns: { type: "radio", options: [
          { value: "2", label: "Two columns" },
          { value: "3", label: "Three columns" },
        ] },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            body: { type: "textarea" },
          },
        },
      },
      defaultProps: {
        eyebrow: "Why us",
        title: "Built different. On purpose.",
        subtitle: "",
        tone: "light",
        numbered: "false",
        columns: "3",
        items: [
          { title: "Trend-native", body: "We don't guess what's trending — we're the generation scrolling it." },
        ],
      },
      render: ({ eyebrow, title, subtitle, tone, numbered, columns, items = [] }) => {
        const dark = tone === "dark";
        return (
          <Section className={dark ? "bg-ink text-white" : "bg-mist"}>
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
              dark={dark}
            />
            <div
              className={`mt-12 grid gap-5 ${
                columns === "2" ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {items.map((card: any, i: number) => (
                <div
                  key={i}
                  className={`flex h-full flex-col gap-4 rounded-[3px] p-7 ${
                    dark ? "bg-white/5 text-white" : "border border-line bg-white"
                  }`}
                >
                  {numbered === "true" ? (
                    <span
                      className={`font-display text-2xl font-semibold ${
                        dark ? "text-brand-bright" : "text-brand"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  ) : null}
                  <h3
                    className={`font-display text-lg font-semibold leading-snug ${
                      dark ? "text-white" : "text-ink"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      dark ? "text-white/60" : "text-ink/65"
                    }`}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        );
      },
    },

    /* -------------------------- Service grid ----------------------------- */
    ServiceGridBlock: {
      label: "Service cards",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            body: { type: "textarea" },
            href: { type: "text" },
          },
        },
      },
      defaultProps: {
        eyebrow: "What we do",
        title: "Three capabilities. One goal: your growth.",
        subtitle: "",
        items: [
          {
            title: "Social Media Management",
            body: "Content that trends, communities that engage, and a feed that sells.",
            href: "/services/social-media-management",
          },
        ],
      },
      render: ({ eyebrow, title, subtitle, items = [] }) => (
        <Section className="bg-mist">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {items.map((service: any, i: number) => (
              <Link
                key={i}
                href={service.href}
                className="group flex h-full flex-col justify-between gap-8 rounded-[3px] border-2 border-ink bg-white p-7 transition-all duration-200 hover:border-brand hover:bg-brand"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/65 transition-colors group-hover:text-white/85">
                    {service.body}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand transition-colors group-hover:text-white">
                  Learn more
                  <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      ),
    },

    /* ----------------------------- Steps -------------------------------- */
    StepsBlock: {
      label: "Steps",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        variant: { type: "radio", options: [
          { value: "cards", label: "Cards grid" },
          { value: "timeline", label: "Timeline" },
        ] },
        dark: { type: "radio", options: [
          { value: "false", label: "Light" },
          { value: "true", label: "Dark" },
        ] },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            body: { type: "textarea" },
          },
        },
      },
      defaultProps: {
        eyebrow: "The method",
        title: "How we move your brand forward",
        subtitle: "",
        variant: "cards",
        dark: "false",
        items: [
          { title: "Listen", body: "Trend and audience intelligence." },
        ],
      },
      render: ({ eyebrow, title, subtitle, variant, dark, items = [] }) => {
        const isDark = dark === "true";
        const timeline = variant === "timeline";
        return (
          <Section className={isDark ? "bg-ink text-white" : "bg-white"}>
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
              dark={isDark}
            />
            {timeline ? (
              <ol className="mt-12 grid gap-0 lg:grid-cols-[1fr_1fr] lg:gap-x-16">
                {items.map((step: any, i: number) => (
                  <li key={i} className="relative flex gap-6 pb-12 last:pb-0">
                    <span className="relative flex flex-col items-center">
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
                          isDark ? "bg-brand-bright text-ink" : "bg-brand text-white"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {i < items.length - 1 ? (
                        <span
                          className={`mt-2 w-px flex-1 ${
                            isDark ? "bg-white/25" : "bg-line"
                          }`}
                        />
                      ) : null}
                    </span>
                    <div className="pb-4">
                      <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          isDark ? "text-white/65" : "text-ink/65"
                        }`}
                      >
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {items.map((step: any, i: number) => (
                  <li
                    key={i}
                    className={`flex h-full flex-col gap-4 pt-5 ${
                      isDark ? "border-t-2 border-brand-bright" : "border-t-2 border-brand"
                    }`}
                  >
                    <span
                      className={`font-display text-3xl font-semibold ${
                        isDark ? "text-brand-bright" : "text-brand"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink/65"
                      }`}
                    >
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Section>
        );
      },
    },

    /* --------------------------- Case grid ------------------------------- */
    CaseGridBlock: {
      label: "Case studies",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            service: { type: "text" },
            metric: { type: "text" },
            result: { type: "text" },
            client: { type: "text" },
          },
        },
      },
      defaultProps: {
        eyebrow: "Proof, not promises",
        title: "Work that speaks for itself",
        subtitle: "",
        items: [],
      },
      render: ({ eyebrow, title, subtitle, items = [] }) => (
        <Section>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {items.map((c: any, i: number) => (
              <div key={i} className="flex h-full flex-col justify-between gap-10 rounded-[3px] border border-line bg-white p-7">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/50">
                    {c.service}
                  </p>
                  <p className="font-display text-4xl font-semibold text-brand">{c.metric}</p>
                  <p className="text-sm leading-relaxed text-ink/70">{c.result}</p>
                </div>
                <span className="text-sm font-bold text-ink">{c.client}</span>
              </div>
            ))}
          </div>
        </Section>
      ),
    },

    /* ------------------------- Testimonials ------------------------------ */
    TestimonialBlock: {
      label: "Testimonials",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            quote: { type: "textarea" },
            name: { type: "text" },
            role: { type: "text" },
          },
        },
      },
      defaultProps: {
        eyebrow: "The feeling",
        title: "Clients who felt the difference",
        items: [],
      },
      render: ({ eyebrow, title, items = [] }) => (
        <Section className="bg-mist">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {items.map((t: any, i: number) => (
              <figure key={i} className="flex h-full flex-col justify-between gap-8 rounded-[3px] bg-white p-8">
                <blockquote className="font-display text-xl font-medium leading-snug text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                    {(t.name || "?").charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{t.name}</span>
                    <span className="block text-xs text-ink/55">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ),
    },

    /* ------------------------------ FAQ ---------------------------------- */
    FaqBlock: {
      label: "FAQ",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            q: { type: "text" },
            a: { type: "textarea" },
          },
        },
      },
      defaultProps: {
        eyebrow: "No guesswork",
        title: "Before you reach out",
        subtitle: "",
        items: [],
      },
      render: ({ eyebrow, title, subtitle, items = [] }) => (
        <Section>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className="mt-12 max-w-3xl divide-y divide-line border-y border-line">
            {items.map((faq: any, i: number) => (
              <details key={i} className="group py-5">
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
        </Section>
      ),
    },

    /* ------------------------------- CTA --------------------------------- */
    CtaBlock: {
      label: "CTA banner",
      fields: {
        title: { type: "textarea" },
        body: { type: "textarea" },
        tone: { type: "radio", options: [
          { value: "orange", label: "Orange" },
          { value: "ink", label: "Dark" },
        ] },
        ctaLabel: { type: "text" },
        whatsappMessage: { type: "textarea" },
        buttonColor: { type: "color" } as any,
        subline: { type: "text" },
      },
      defaultProps: {
        title: "Let's make your brand the one they talk about.",
        body: "",
        tone: "orange",
        ctaLabel: "Chat on WhatsApp",
        whatsappMessage: "Hi Sociolab, I want to grow my brand online.",
        buttonColor: "#0d0d0d",
        subline: "We reply fast — usually within the hour",
      },
      render: ({ title, body, tone, ctaLabel, whatsappMessage, buttonColor, subline }) => (
        <section className={`py-20 sm:py-28 ${tone === "ink" ? "bg-ink" : "bg-brand"}`}>
          <Container>
            <div className="flex flex-col items-center gap-6 text-center">
              <h2 className="max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
                {title}
              </h2>
              {body ? <p className="text-lg font-medium text-white/85">{body}</p> : null}
              <WhatsAppLink
                cta="puck-cta"
                message={whatsappMessage}
                className={`mt-2 inline-flex items-center gap-2.5 rounded-[3px] px-8 py-4 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  tone === "ink"
                    ? "bg-[var(--cta)] hover:bg-[color-mix(in_srgb,var(--cta),#000_14%)]"
                    : "bg-[var(--cta)] hover:bg-[color-mix(in_srgb,var(--cta),#000_14%)]"
                } ${
                  /^#(f[0-9a-f]{5}|f{6}|e[0-9a-f]{5})$/i.test(buttonColor || "")
                    ? "text-ink"
                    : "text-white"
                }`}
                style={{ "--cta": buttonColor || "#0d0d0d" } as React.CSSProperties}
              >
                <WhatsAppIcon className="size-5" />
                {ctaLabel || "Chat on WhatsApp"}
              </WhatsAppLink>
              {subline ? (
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  {subline}
                </p>
              ) : null}
            </div>
          </Container>
        </section>
      ),
    },

    /* --------------------------- Statement ------------------------------- */
    StatementBlock: {
      label: "Statement",
      fields: {
        eyebrow: { type: "text" },
        text: { type: "textarea" },
        tone: { type: "radio", options: [
          { value: "ink", label: "Dark" },
          { value: "orange", label: "Orange" },
          { value: "light", label: "Light" },
        ] },
      },
      defaultProps: {
        eyebrow: "What we're about",
        text: "A big, bold statement.",
        tone: "ink",
      },
      render: ({ eyebrow, text, tone }) => (
        <section
          className={`py-20 sm:py-24 ${
            tone === "orange" ? "bg-brand" : tone === "light" ? "bg-white" : "bg-ink"
          }`}
        >
          <Container>
            <div className="max-w-3xl">
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              <p
                className={`mt-6 whitespace-pre-line font-display text-2xl font-medium leading-snug sm:text-4xl ${
                  tone === "light" ? "text-ink" : "text-white"
                }`}
              >
                {text}
              </p>
            </div>
          </Container>
        </section>
      ),
    },

    /* ---------------------------- Callout -------------------------------- */
    CalloutBlock: {
      label: "Callout",
      fields: {
        label: { type: "text" },
        text: { type: "textarea" },
      },
      defaultProps: {
        label: "Not for you?",
        text: "If any of this feels like a mismatch, we'll tell you straight.",
      },
      render: ({ label, text }) => (
        <section className="bg-mist">
          <Container className="py-10">
            <p className="max-w-3xl font-mono text-sm font-medium leading-relaxed text-ink/75">
              <span className="font-bold text-brand">{label} </span>
              {text}
            </p>
          </Container>
        </section>
      ),
    },

    /* ----------------------------- Text ---------------------------------- */
    TextBlock: {
      label: "Text",
      fields: {
        paragraphs: {
          type: "array",
          arrayFields: { paragraph: { type: "textarea" } },
        },
        align: { type: "radio", options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ] },
      },
      defaultProps: {
        paragraphs: [],
        align: "left",
      },
      render: ({ paragraphs = [], align }) => (
        <Section className="bg-white">
          <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
            {paragraphs.map((p: any, i: number) => (
              <p key={i} className="mb-5 text-lg leading-relaxed text-ink/80">
                {p.paragraph}
              </p>
            ))}
          </div>
        </Section>
      ),
    },

    /* ------------------------ Deliverables ------------------------------- */
    DeliverablesBlock: {
      label: "Deliverables checklist",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        intro: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: { item: { type: "text" } },
        },
      },
      defaultProps: {
        eyebrow: "What's included",
        title: "What you get",
        intro: "",
        items: [],
      },
      render: ({ eyebrow, title, intro, items = [] }) => (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div className="max-w-xl">
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {title}
              </h2>
              {intro ? <p className="mt-5 text-lg leading-relaxed text-ink/70">{intro}</p> : null}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((item: any, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-[3px] border border-line bg-white px-5 py-4"
                >
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span className="text-sm font-medium text-ink">{item.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ),
    },

    /* ----------------------------- Image ---------------------------------- */
    ImageBlock: {
      label: "Image",
      fields: {
        src: { type: "image" } as any,
        alt: { type: "text" },
        caption: { type: "text" },
        aspect: { type: "radio", options: [
          { value: "16 / 9", label: "Wide (16:9)" },
          { value: "4 / 3", label: "Classic (4:3)" },
          { value: "1 / 1", label: "Square (1:1)" },
        ] },
      },
      defaultProps: {
        src: "",
        alt: "",
        caption: "",
        aspect: "16 / 9",
      },
      render: ({ src, alt, caption, aspect }) => (
        <Section className="bg-white">
          <figure className="overflow-hidden rounded-[3px] border border-line bg-mist">
            <div style={{ aspectRatio: aspect || "16 / 9" }} className="relative w-full">
              {src ? (
                <Image src={src} alt={alt || ""} fill className="object-cover" sizes="(max-width: 1200px) 100vw, 1200px" />
              ) : null}
            </div>
            {caption ? (
              <figcaption className="px-6 py-4 text-sm text-ink/60">{caption}</figcaption>
            ) : null}
          </figure>
        </Section>
      ),
    },

    /* --------------------------- Two column ------------------------------ */
    TwoColumnBlock: {
      label: "Two-column (text + image)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        body: { type: "textarea" },
        checklist: {
          type: "array",
          arrayFields: { item: { type: "text" } },
        },
        ctaLabel: { type: "text" },
        ctaHref: { type: "text" },
        imageSrc: { type: "image" } as any,
        imageAlt: { type: "text" },
        flip: { type: "radio", options: [
          { value: "false", label: "Text left" },
          { value: "true", label: "Image left" },
        ] },
      },
      defaultProps: {
        eyebrow: "",
        title: "Title",
        body: "Body text.",
        checklist: [],
        ctaLabel: "",
        ctaHref: "",
        imageSrc: "",
        imageAlt: "",
        flip: "false",
      },
      render: ({ eyebrow, title, body, checklist = [], ctaLabel, ctaHref, imageSrc, imageAlt, flip }) => (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className={flip === "true" ? "lg:order-2" : ""}>
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {title}
              </h2>
              <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-ink/70">{body}</p>
              {checklist.length ? (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {checklist.map((item: any, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                      {item.item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {ctaLabel && ctaHref ? (
                <div className="mt-8">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
                  >
                    {ctaLabel}
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                </div>
              ) : null}
            </div>
            <div
              className={`relative w-full overflow-hidden rounded-[3px] border border-line bg-mist ${
                flip === "true" ? "lg:order-1" : ""
              }`}
              style={{ aspectRatio: "4 / 3" }}
            >
              {imageSrc ? (
                <Image src={imageSrc} alt={imageAlt || ""} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : null}
            </div>
          </div>
        </Section>
      ),
    },

    /* ----------------------------- Stats ---------------------------------- */
    StatsBlock: {
      label: "Stats band",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        dark: { type: "radio", options: [
          { value: "false", label: "Light" },
          { value: "true", label: "Dark" },
        ] },
        items: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" },
          },
        },
      },
      defaultProps: {
        eyebrow: "",
        title: "",
        dark: "false",
        items: [
          { value: "50+", label: "brands grown" },
          { value: "30M+", label: "views generated" },
          { value: "100%", label: "in-house team" },
        ],
      },
      render: ({ eyebrow, title, dark, items = [] }) => {
        const isDark = dark === "true";
        return (
          <Section className={isDark ? "bg-ink text-white" : "bg-white"}>
            <SectionHeading eyebrow={eyebrow} title={title} dark={isDark} />
            <dl className={`mt-12 grid gap-8 border-t pt-10 sm:grid-cols-3 ${isDark ? "border-white/20" : "border-line"}`}>
              {items.map((stat: any, i: number) => (
                <div key={i} className="flex flex-col gap-1">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    <span className={isDark ? "text-brand-bright" : "text-brand"}>{stat.value}</span>
                  </dd>
                  <dd className={isDark ? "text-sm text-white/70" : "text-sm text-ink/60"}>
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        );
      },
    },

    /* ---------------------------- Features -------------------------------- */
    FeaturesBlock: {
      label: "Features list",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        dark: { type: "radio", options: [
          { value: "false", label: "Light" },
          { value: "true", label: "Dark" },
        ] },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            body: { type: "textarea" },
          },
        },
      },
      defaultProps: {
        eyebrow: "",
        title: "What you get",
        subtitle: "",
        dark: "false",
        items: [
          { title: "A clear plan", body: "Strategy first, always." },
        ],
      },
      render: ({ eyebrow, title, subtitle, dark, items = [] }) => {
        const isDark = dark === "true";
        return (
          <Section className={isDark ? "bg-ink text-white" : "bg-mist"}>
            <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} dark={isDark} />
            <ul className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {items.map((feature: any, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full ${isDark ? "bg-brand-bright text-ink" : "bg-brand text-white"}`}>
                    <CheckIcon className="size-3.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{feature.title}</h3>
                    <p className={`mt-1 text-sm leading-relaxed ${isDark ? "text-white/65" : "text-ink/65"}`}>
                      {feature.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        );
      },
    },

    /* ----------------------------- Pricing -------------------------------- */
    PricingBlock: {
      label: "Pricing",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        note: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            price: { type: "text" },
            period: { type: "text" },
            blurb: { type: "textarea" },
            featured: { type: "radio", options: [
              { value: "false", label: "Standard" },
              { value: "true", label: "Highlighted" },
            ] },
            ctaLabel: { type: "text" },
            ctaHref: { type: "text" },
            features: {
              type: "array",
              arrayFields: { feature: { type: "text" } },
            },
          },
        },
      },
      defaultProps: {
        eyebrow: "Simple pricing",
        title: "Pick the engagement that fits",
        subtitle: "",
        note: "",
        items: [
          {
            name: "Starter",
            price: "PKR 60k",
            period: "/month",
            blurb: "For brands getting started.",
            featured: "false",
            ctaLabel: "Chat on WhatsApp",
            ctaHref: "/contact",
            features: [{ feature: "8 posts a month" }, { feature: "Monthly report" }],
          },
        ],
      },
      render: ({ eyebrow, title, subtitle, note, items = [] }) => (
        <Section className="bg-white">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {items.map((plan: any, i: number) => {
              const featured = plan.featured === "true";
              return (
                <div
                  key={i}
                  className={`flex h-full flex-col justify-between gap-8 rounded-[3px] p-8 ${
                    featured ? "bg-ink text-white shadow-xl" : "border border-line bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <p className={`font-mono text-xs font-bold uppercase tracking-[0.18em] ${featured ? "text-brand-bright" : "text-brand"}`}>
                      {plan.name}
                    </p>
                    <p className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-semibold">{plan.price}</span>
                      {plan.period ? (
                        <span className={`text-sm ${featured ? "text-white/60" : "text-ink/50"}`}>
                          {plan.period}
                        </span>
                      ) : null}
                    </p>
                    {plan.blurb ? (
                      <p className={`text-sm leading-relaxed ${featured ? "text-white/65" : "text-ink/60"}`}>
                        {plan.blurb}
                      </p>
                    ) : null}
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {(plan.features ?? []).map((feature: any, j: number) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm font-medium">
                        <CheckIcon className={`mt-0.5 size-4 shrink-0 ${featured ? "text-brand-bright" : "text-brand"}`} />
                        <span className={featured ? "text-white/85" : "text-ink/80"}>{feature.feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.ctaLabel ? (
                    <Link
                      href={plan.ctaHref || "/contact"}
                      className={`inline-flex items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-sm font-bold transition-colors ${
                        featured
                          ? "bg-brand text-white hover:bg-brand-dark"
                          : "border-2 border-ink text-ink hover:bg-ink hover:text-white"
                      }`}
                    >
                      {plan.ctaLabel}
                      <ArrowUpRightIcon className="size-4" />
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
          {note ? <p className="mt-8 max-w-2xl text-sm text-ink/55">{note}</p> : null}
        </Section>
      ),
    },

    /* ------------------------------ Team ----------------------------------- */
    TeamBlock: {
      label: "Team",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            role: { type: "text" },
            bio: { type: "textarea" },
            photo: { type: "image" } as any,
          },
        },
      },
      defaultProps: {
        eyebrow: "The team",
        title: "The people behind the work",
        subtitle: "",
        items: [],
      },
      render: ({ eyebrow, title, subtitle, items = [] }) => (
        <Section className="bg-mist">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((member: any, i: number) => (
              <div key={i} className="flex h-full flex-col overflow-hidden rounded-[3px] border border-line bg-white">
                <div className="relative aspect-[4/5] w-full bg-mist">
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name || ""} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-display text-5xl font-semibold text-ink/15">
                      {(member.name || "?").charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{member.name}</h3>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
                    {member.role}
                  </p>
                  {member.bio ? (
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">{member.bio}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ),
    },

    /* ---------------------------- Gallery --------------------------------- */
    GalleryBlock: {
      label: "Gallery",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        items: {
          type: "array",
          arrayFields: {
            src: { type: "image" } as any,
            alt: { type: "text" },
            caption: { type: "text" },
          },
        },
      },
      defaultProps: {
        eyebrow: "",
        title: "Recent work",
        subtitle: "",
        items: [],
      },
      render: ({ eyebrow, title, subtitle, items = [] }) => (
        <Section className="bg-white">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((img: any, i: number) => (
              <figure key={i} className="overflow-hidden rounded-[3px] border border-line bg-mist">
                <div className="relative aspect-square w-full">
                  {img.src ? (
                    <Image src={img.src} alt={img.alt || ""} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                  ) : null}
                </div>
                {img.caption ? (
                  <figcaption className="px-5 py-3 text-sm text-ink/60">{img.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </Section>
      ),
    },

    /* ------------------------- Contact form ------------------------------- */
    ContactFormBlock: {
      label: "Contact form (WhatsApp)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        sub: { type: "textarea" },
        buttonLabel: { type: "text" },
        whatsappMessage: { type: "textarea" },
        subline: { type: "text" },
        tone: { type: "radio", options: [
          { value: "false", label: "Light" },
          { value: "true", label: "Dark" },
        ] },
      },
      defaultProps: {
        eyebrow: "Get in touch",
        title: "Tell us about your brand",
        sub: "Fill this in and it opens WhatsApp with your message ready to send.",
        buttonLabel: "Send on WhatsApp",
        whatsappMessage: "Hi Sociolab, I want to talk about my brand.",
        subline: "We reply fast — usually within the hour",
        tone: "false",
      },
      render: ({ eyebrow, title, sub, buttonLabel, whatsappMessage, subline, tone }) => {
        const isDark = tone === "true";
        return (
          <Section className={isDark ? "bg-ink text-white" : "bg-mist"}>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <div className="max-w-xl">
                <SectionHeading eyebrow={eyebrow} title={title} subtitle={sub} dark={isDark} />
              </div>
              <div className={isDark ? "rounded-[3px] bg-white/5 p-8" : ""}>
                <ContactForm
                  message={whatsappMessage}
                  buttonLabel={buttonLabel}
                  subline={subline}
                />
              </div>
            </div>
          </Section>
        );
      },
    },

    /* ----------------------------- Video ---------------------------------- */
    VideoBlock: {
      label: "Video",
      fields: {
        title: { type: "text" },
        src: { type: "text" },
        caption: { type: "text" },
      },
      defaultProps: {
        title: "",
        src: "",
        caption: "",
      },
      render: ({ title, src, caption }) => {
        const embed = src ? videoEmbed(src) : null;
        return (
          <Section className="bg-white">
            <div className="max-w-4xl">
              {title ? <h2 className="mb-6 font-display text-2xl font-semibold text-ink">{title}</h2> : null}
              {embed ? (
                <div className="aspect-video w-full overflow-hidden rounded-[3px] border border-line bg-ink">
                  <iframe
                    src={embed}
                    title={title || "Video"}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : src ? (
                <video src={src} controls className="aspect-video w-full rounded-[3px] border border-line bg-ink" />
              ) : null}
              {caption ? (
                <p className="mt-4 text-sm text-ink/60">{caption}</p>
              ) : null}
            </div>
          </Section>
        );
      },
    },

    /* ----------------------------- Blog hero ------------------------------ */
    BlogHeroBlock: {
      label: "Blog hero",
      fields: {
        category: { type: "text" },
        title: { type: "textarea" },
        excerpt: { type: "textarea" },
        author: { type: "text" },
        date: { type: "text" },
        coverImage: { type: "image" } as any,
        readTime: { type: "text" },
      },
      defaultProps: {
        category: "Strategy",
        title: "How the best brands turn trends into sales.",
        excerpt:
          "Trends come and go in days. The brands that win don't chase every one — they build a system for spotting the ones that matter.",
        author: "Sociolab Team",
        date: "August 2026",
        coverImage: "",
        readTime: "6 min read",
      },
      render: ({ category, title, excerpt, author, date, coverImage, readTime }) => (
        <section className="relative overflow-hidden bg-ink pt-16 pb-14 sm:pt-20 sm:pb-20">
          <Container>
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                {category ? (
                  <span className="rounded-full border border-brand-bright px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-bright">
                    {category}
                  </span>
                ) : null}
                {readTime ? (
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    {readTime}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-6 whitespace-pre-line font-display text-3xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{excerpt}</p>
              ) : null}
              {(author || date) && (
                <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  {author ? `By ${author}` : ""}
                  {author && date ? " — " : ""}
                  {date ? date : ""}
                </p>
              )}
            </div>
          </Container>
          {coverImage ? (
            <div className="relative mx-auto mt-10 max-w-6xl px-6">
              <Image
                src={coverImage}
                alt={title || "Post cover"}
                width={1600}
                height={900}
                className="aspect-[16/9] w-full rounded-[3px] object-cover"
                sizes="100vw"
              />
            </div>
          ) : null}
        </section>
      ),
    },

    /* ----------------------------- Pull quote ----------------------------- */
    QuoteBlock: {
      label: "Pull quote",
      fields: {
        quote: { type: "textarea" },
        attribution: { type: "text" },
      },
      defaultProps: {
        quote: "Speed wins. But only if you're building something people actually want to keep.",
        attribution: "",
      },
      render: ({ quote, attribution }) => (
        <Section className="bg-mist">
          <blockquote className="mx-auto max-w-3xl border-l-4 border-brand pl-8 sm:pl-12">
            <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
              “{quote}”
            </p>
            {attribution ? (
              <footer className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                — {attribution}
              </footer>
            ) : null}
          </blockquote>
        </Section>
      ),
    },

    /* ----------------------------- Author card ---------------------------- */
    AuthorBlock: {
      label: "Author card",
      fields: {
        name: { type: "text" },
        role: { type: "text" },
        photo: { type: "image" } as any,
        bio: { type: "textarea" },
      },
      defaultProps: {
        name: "Sociolab Team",
        role: "Growth & content team",
        photo: "",
        bio: "We build trend-native brands — producing content, running social, and turning attention into WhatsApp conversations.",
      },
      render: ({ name, role, photo, bio }) => (
        <Section className="bg-white">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[3px] border border-line bg-mist p-8 text-center sm:flex-row sm:items-start sm:text-left">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                width={96}
                height={96}
                className="size-24 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="grid size-24 shrink-0 place-items-center rounded-full bg-brand font-display text-3xl font-semibold text-white">
                {name?.charAt(0) || "S"}
              </div>
            )}
            <div>
              <p className="font-display text-lg font-semibold text-ink">{name}</p>
              {role ? <p className="mt-0.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">{role}</p> : null}
              {bio ? <p className="mt-3 text-sm leading-relaxed text-ink/70">{bio}</p> : null}
            </div>
          </div>
        </Section>
      ),
    },

    /* ----------------------------- Tags ----------------------------------- */
    TagsBlock: {
      label: "Tags",
      fields: {
        tags: {
          type: "array",
          arrayFields: { tag: { type: "text" } },
        },
      },
      defaultProps: {
        tags: [{ tag: "Growth" }, { tag: "Content" }, { tag: "Strategy" }],
      },
      render: ({ tags = [] }) => (
        <Section className="bg-white">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
            {tags.map((item: any, i: number) => (
              <span
                key={i}
                className="rounded-full bg-mist px-4 py-1.5 font-mono text-xs font-semibold text-ink/80"
              >
                #{item.tag}
              </span>
            ))}
          </div>
        </Section>
      ),
    },

    /* ----------------------------- Link ---------------------------------- */
    LinkBlock: {
      label: "Button link",
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        style: { type: "radio", options: [
          { value: "solid", label: "Solid" },
          { value: "outline", label: "Outline" },
        ] },
        color: { type: "color" } as any,
      },
      defaultProps: {
        label: "Learn more",
        href: "/",
        style: "solid",
        color: "#ff4d00",
      },
      render: ({ label, href, style, color }) => (
        <Section className="bg-white">
          <div className="flex flex-wrap gap-4">
            <Link
              href={href}
              className={`inline-flex items-center gap-2 rounded-[3px] px-6 py-3 text-sm font-bold transition-colors ${
                style === "outline"
                  ? "border-2 border-[var(--link)] text-[var(--link)] hover:bg-[var(--link)] hover:text-white"
                  : `bg-[var(--link)] ${/^#(f[0-9a-f]{5}|f{6}|e[0-9a-f]{5})$/i.test(color || "") ? "text-ink" : "text-white"} hover:bg-[color-mix(in_srgb,var(--link),#000_14%)]`
              }`}
              style={{ "--link": color || "#ff4d00" } as React.CSSProperties}
            >
              {label}
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        </Section>
      ),
},
    CRMCaseGrid: {
      label: "Case Studies (CRM)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        caseStudyIds: {
          type: "array",
          arrayFields: { id: { type: "text" } },
        },
      },
      defaultProps: {
        eyebrow: "Proof, not promises",
        title: "Work that speaks for itself",
        subtitle: "",
        caseStudyIds: [],
      },
      render: ({ eyebrow, title, subtitle, caseStudyIds = [] }) => (
        <CRMCaseGrid eyebrow={eyebrow} title={title} subtitle={subtitle} caseStudyIds={caseStudyIds.map((c: any) => c.id)} />
      ),
    },
    CRMTeamBlock: {
      label: "Team (CRM)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        memberIds: {
          type: "array",
          arrayFields: { id: { type: "text" } },
        },
      },
      defaultProps: {
        eyebrow: "The team",
        title: "The people behind the work",
        subtitle: "",
        memberIds: [],
      },
      render: ({ eyebrow, title, subtitle, memberIds = [] }) => (
        <CRMTeamBlock eyebrow={eyebrow} title={title} subtitle={subtitle} memberIds={memberIds.map((m: any) => m.id)} />
      ),
    },
    CRMServiceGrid: {
      label: "Services (CRM)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        serviceIds: {
          type: "array",
          arrayFields: { id: { type: "text" } },
        },
      },
      defaultProps: {
        eyebrow: "What we do",
        title: "Three capabilities. One goal: your growth.",
        subtitle: "",
        serviceIds: [],
      },
      render: ({ eyebrow, title, subtitle, serviceIds = [] }) => (
        <CRMServiceGrid eyebrow={eyebrow} title={title} subtitle={subtitle} serviceIds={serviceIds.map((s: any) => s.id)} />
      ),
    },
    CRMPricingBlock: {
      label: "Pricing (CRM)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        subtitle: { type: "textarea" },
        note: { type: "textarea" },
        serviceIds: {
          type: "array",
          arrayFields: { id: { type: "text" } },
        },
      },
      defaultProps: {
        eyebrow: "Simple pricing",
        title: "Pick the engagement that fits",
        subtitle: "",
        note: "",
        serviceIds: [],
      },
      render: ({ eyebrow, title, subtitle, note, serviceIds = [] }) => (
        <CRMPricingBlock eyebrow={eyebrow} title={title} subtitle={subtitle} note={note} serviceIds={serviceIds.map((s: any) => s.id)} />
      ),
    },
    CRMTestimonialBlock: {
      label: "Testimonials (CRM)",
      fields: {
        eyebrow: { type: "text" },
        title: { type: "textarea" },
        testimonialIds: {
          type: "array",
          arrayFields: { id: { type: "text" } },
        },
      },
      defaultProps: {
        eyebrow: "The feeling",
        title: "Clients who felt the difference",
        testimonialIds: [],
      },
      render: ({ eyebrow, title, testimonialIds = [] }) => (
        <CRMTestimonialBlock eyebrow={eyebrow} title={title} testimonialIds={testimonialIds.map((t: any) => t.id)} />
      ),
    },
  },
};

export default config;