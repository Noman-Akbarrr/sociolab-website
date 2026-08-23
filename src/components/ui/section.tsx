import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand">
      {children}
    </p>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-4 ${alignCls} max-w-3xl`}>
      {eyebrow ? (
        dark ? (
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-bright">
            {eyebrow}
          </p>
        ) : (
          <Eyebrow>{eyebrow}</Eyebrow>
        )
      ) : null}
      <h2
        className={`font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`max-w-2xl text-lg leading-relaxed ${
            dark ? "text-white/70" : "text-ink/70"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}