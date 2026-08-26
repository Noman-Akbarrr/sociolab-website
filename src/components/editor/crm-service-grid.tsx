"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
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
  icon?: string;
}

interface CRMServiceGridProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  serviceIds?: string[];
}

export function CRMServiceGrid({ eyebrow, title, subtitle, serviceIds = [] }: CRMServiceGridProps) {
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
      <Section className="bg-mist">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group flex h-full flex-col justify-between gap-8 rounded-[3px] border-2 border-ink bg-white p-7 animate-pulse">
              <div className="h-6 w-1/2 bg-mist rounded" />
              <div className="h-8 w-3/4 bg-mist rounded" />
              <div className="h-4 w-1/4 bg-mist rounded" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-mist">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-ink/50">
            No services found. Add some in the CRM admin.
          </div>
        ) : (
          services.map((service: Service, i: number) => (
            <Link
              key={service.id}
              href={service.href || `/services/${service.slug}`}
              className="group flex h-full flex-col justify-between gap-8 rounded-[3px] border-2 border-ink bg-white p-7 transition-all duration-200 hover:border-brand hover:bg-brand"
            >
              <div className="flex flex-col gap-3">
                {(service.icon || service.featured) && (
                  <div className="flex items-center gap-2">
                    {service.icon && <span className="text-2xl">{service.icon}</span>}
                    {service.featured && <span className="inline-flex items-center rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">Featured</span>}
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-white">
                  {service.name}
                </h3>
                <p className="text-sm leading-relaxed text-ink/65 transition-colors group-hover:text-white/85">
                  {service.shortDesc || service.description.slice(0, 120) + "..."}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand transition-colors group-hover:text-white">
                Learn more
                <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))
        )}
      </div>
    </Section>
  );
}