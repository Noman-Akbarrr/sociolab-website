import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";

type Variant = "primary" | "secondary" | "whatsapp" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-semibold transition-all duration-150 disabled:opacity-50 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5500]";

const variants: Record<Variant, string> = {
  primary: [
    "bg-[#FF5500] text-white",
    "hover:bg-[#E04B00] hover:-translate-y-0.5",
    "active:translate-y-0",
  ].join(" "),
  secondary: [
    "bg-transparent border border-[#334155] text-[#F8FAFC]",
    "hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.05)] hover:text-[#FF5500]",
  ].join(" "),
  whatsapp: [
    "bg-[#1F2937] border border-[#374151] text-[#F9FAFB]",
    "hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.08)]",
  ].join(" "),
  ghost: "text-[#F8FAFC] hover:text-[#FF5500]",
};

type ButtonProps = {
  variant?: Variant;
  href?: string;
  icon?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href">;

export function Button({
  variant = "primary",
  href,
  icon = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
          {icon && <ArrowRightIcon className="size-4 shrink-0" />}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...props}>
        {children}
        {icon && <ArrowRightIcon className="size-4 shrink-0" />}
      </Link>
    );
  }
  return (
    <button className={cls} {...(props as ComponentProps<"button">)}>
      {children}
      {icon && <ArrowRightIcon className="size-4 shrink-0" />}
    </button>
  );
}

export function WhatsAppButton({
  href,
  children,
  className = "",
  ...props
}: {
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"a">, "href">) {
  const cls = `${base} ${variants.whatsapp} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props}>
        <WhatsAppIcon className="size-5 shrink-0" />
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(props as ComponentProps<"button">)}>
      <WhatsAppIcon className="size-5 shrink-0" />
      {children}
    </button>
  );
}
