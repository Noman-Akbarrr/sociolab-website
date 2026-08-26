"use client";

import { useEffect, useState } from "react";
import { Section, SectionHeading } from "@/components/ui/section";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  photo?: string;
}

interface CRMTestimonialBlockProps {
  eyebrow?: string;
  title?: string;
  testimonialIds?: string[];
}

export function CRMTestimonialBlock({ eyebrow, title, testimonialIds = [] }: CRMTestimonialBlockProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/crm/testimonials");
        const data = await res.json();
        let testimonials = data.testimonials || [];
        if (testimonialIds.length > 0) {
          testimonials = testimonials.filter((t: Testimonial) => testimonialIds.includes(t.id));
        }
        setTestimonials(testimonials);
      } catch (e) {
        console.error("Failed to fetch testimonials:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, [testimonialIds.join(",")]);

  if (loading) {
    return (
      <Section className="bg-mist">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[1, 2].map((i) => (
            <figure key={i} className="flex h-full flex-col justify-between gap-8 rounded-[3px] bg-white p-8 animate-pulse">
              <div className="h-16 w-full bg-mist rounded" />
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-brand" />
                <div className="space-y-1">
                  <div className="h-4 w-1/3 bg-mist rounded" />
                  <div className="h-3 w-1/4 bg-mist rounded" />
                </div>
              </div>
            </figure>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-mist">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {testimonials.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-ink/50">
            No approved testimonials found. Add some in the CRM admin.
          </div>
        ) : (
          testimonials.map((t: Testimonial, i: number) => (
            <figure key={t.id} className="flex h-full flex-col justify-between gap-8 rounded-[3px] bg-white p-8">
              <blockquote className="font-display text-xl font-medium leading-snug text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="grid size-11 place-items-center rounded-full object-cover" />
                ) : (
                  <span className="grid size-11 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                    {(t.name || "?").charAt(0)}
                  </span>
                )}
                <span>
                  <span className="block text-sm font-bold text-ink">{t.name}</span>
                  <span className="block text-xs text-ink/55">{t.role}{t.company ? `, ${t.company}` : ""}</span>
                </span>
              </figcaption>
            </figure>
          ))
        )}
      </div>
    </Section>
  );
}