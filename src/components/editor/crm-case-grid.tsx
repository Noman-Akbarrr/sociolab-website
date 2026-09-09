"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";

interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  service: string;
  metric: string;
  result: string;
}

interface CRMCaseGridProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  caseStudyIds?: string[];
}

export function CRMCaseGrid({ eyebrow, title, subtitle, caseStudyIds = [] }: CRMCaseGridProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const res = await fetch("/api/crm/case-studies");
        const data = await res.json();
        let studies = data.caseStudies || [];
        if (caseStudyIds.length > 0) {
          studies = studies.filter((c: CaseStudy) => caseStudyIds.includes(c.id));
        }
        setCaseStudies(studies);
      } catch (e) {
        console.error("Failed to fetch case studies:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCaseStudies();
  }, [caseStudyIds.join(",")]);

  if (loading) {
    return (
      <Section>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-full flex-col justify-between gap-10 rounded-[3px] border border-[#1E293B] bg-[#111827] p-7 animate-pulse">
              <div className="flex flex-col gap-4">
                <div className="h-4 w-1/4 bg-[#1E293B] rounded" />
                <div className="h-12 w-1/2 bg-[#1E293B] rounded" />
                <div className="h-8 w-3/4 bg-[#1E293B] rounded" />
              </div>
              <div className="h-5 w-1/3 bg-[#1E293B] rounded" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {caseStudies.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-white/50">
            No case studies found. Create some in the CRM admin.
          </div>
        ) : (
          caseStudies.map((c: CaseStudy, i: number) => (
            <Link key={c.id} href={`/work/${c.slug}`} className="group flex h-full flex-col justify-between gap-10 rounded-[3px] border border-[#1E293B] bg-[#111827] p-7 transition-colors hover:border-[#FF5500]">
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  {c.service}
                </p>
                <p className="font-display text-4xl font-semibold text-[#FF5500] group-hover:text-[#E04B00]">
                  {c.metric}
                </p>
                <p className="text-sm leading-relaxed text-white/70">{c.result}</p>
              </div>
              <span className="text-sm font-bold text-white group-hover:text-[#FF5500]">{c.client}</span>
            </Link>
          ))
        )}
      </div>
    </Section>
  );
}
