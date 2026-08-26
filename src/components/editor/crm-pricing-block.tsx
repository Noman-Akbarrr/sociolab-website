"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon, CheckIcon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui/section";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  href?: string;
  price?: number;
  period?: string;
  featured: boolean;
  features: string[];
  ctaLabel?: string;
}

interface CRMPricingBlockProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  note?: string;
  serviceIds?: string[];
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export function CRMPricingBlock({ eyebrow, title, subtitle, note, serviceIds = [] }: CRMPricingBlockProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/crm/services");
        const data = await res.json();
        let svcs = data.services || [];
        if (serviceIds.length > 0) {
          svcs = svcs.filter((s: Service) => serviceIds.includes(s.id));
        }
        setServices(svcs);
      } catch (e) {
        console.error("Failed to fetch services:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [serviceIds.join(",")]);

  if (loading) {
    return (
      <Section className="bg-white">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-full flex-col justify-between gap-8 rounded-[3px] p-8 animate-pulse">
              <div className="flex flex-col gap-3">
                <div className="h-4 w-1/3 bg-mist rounded" />
                <div className="h-10 w-1/2 bg-mist rounded" />
              </div>
              <div className="space-y-2.5">
                {[1, 2, 3].map((j) => <div key={j} className="h-5 w-3/4 bg-mist rounded" />)}
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  const featuredServices = services.filter(s => s.featured && s.price);
  const regularServices = services.filter(s => !s.featured && s.price);

  return (
    <Section className="bg-white">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-ink/50">
            No services with pricing found. Add services with prices in the CRM admin.
          </div>
        ) : (
          [...featuredServices, ...regularServices].map((service: Service, i: number) => {
            const featured = service.featured;
            const price = service.price ? formatPrice(service.price) : "Custom";
            return (
              <div
                key={service.id}
                className={`flex h-full flex-col justify-between gap-8 rounded-[3px] p-8 ${
                  featured ? "bg-ink text-white shadow-xl" : "border border-line bg-white"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <p className={`font-mono text-xs font-bold uppercase tracking-[0.18em] ${featured ? "text-brand-bright" : "text-brand"}`}>
                    {service.name}
                  </p>
                  <p className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold">{price}</span>
                    {service.period ? (
                      <span className={`text-sm ${featured ? "text-white/60" : "text-ink/50"}`}>
                        {service.period}
                      </span>
                    ) : null}
                  </p>
                  {service.shortDesc ? (
                    <p className={`text-sm leading-relaxed ${featured ? "text-white/65" : "text-ink/60"}`}>
                      {service.shortDesc}
                    </p>
                  ) : null}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {(service.features ?? []).map((feature: string, j: number) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm font-medium">
                      <CheckIcon className={`mt-0.5 size-4 shrink-0 ${featured ? "text-brand-bright" : "text-brand"}`} />
                      <span className={featured ? "text-white/85" : "text-ink/80"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                {service.ctaLabel || service.href ? (
                  <Link
                    href={service.href || "/contact"}
                    className={`inline-flex items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-sm font-bold transition-colors ${
                      featured
                        ? "bg-brand text-white hover:bg-brand-dark"
                        : "border-2 border-ink text-ink hover:bg-ink hover:text-white"
                    }`}
                  >
                    {service.ctaLabel || "Get Started"}
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                ) : null}
              </div>
            );
          })
        )}
      </div>
      {note ? <p className="mt-8 max-w-2xl text-sm text-ink/55">{note}</p> : null}
    </Section>
  );
}