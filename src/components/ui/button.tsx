import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";

type Variant = "primary" | "dark" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[3px] px-6 py-3 text-sm font-bold tracking-tight transition-all duration-200 disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark hover:translate-y-[-1px] active:translate-y-[1px]",
  dark: "bg-ink text-white hover:bg-ink-soft hover:translate-y-[-1px] active:translate-y-[1px]",
  outline:
    "border-2 border-ink text-ink hover:bg-ink hover:text-white active:translate-y-[1px]",
  ghost: "text-ink hover:text-brand",
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