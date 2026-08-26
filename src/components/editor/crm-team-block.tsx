"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
}

interface CRMTeamBlockProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  memberIds?: string[];
}

export function CRMTeamBlock({ eyebrow, title, subtitle, memberIds = [] }: CRMTeamBlockProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("/api/crm/team-members");
        const data = await res.json();
        let team = data.members || [];
        if (memberIds.length > 0) {
          team = team.filter((m: TeamMember) => memberIds.includes(m.id));
        }
        setMembers(team);
      } catch (e) {
        console.error("Failed to fetch team members:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [memberIds.join(",")]);

  if (loading) {
    return (
      <Section className="bg-mist">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-full flex-col overflow-hidden rounded-[3px] border border-line bg-white animate-pulse">
              <div className="relative aspect-[4/5] w-full bg-mist" />
              <div className="flex flex-col gap-1 p-6">
                <div className="h-6 w-1/3 bg-mist rounded" />
                <div className="h-4 w-1/4 bg-mist rounded" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-mist">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-ink/50">
            No team members found. Add some in the CRM admin.
          </div>
        ) : (
          members.map((member: TeamMember, i: number) => (
            <div key={member.id} className="flex h-full flex-col overflow-hidden rounded-[3px] border border-line bg-white">
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
                {(member.linkedin || member.twitter) && (
                  <div className="mt-3 flex items-center gap-3">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink/50 hover:text-brand">
                        <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-ink/50 hover:text-brand">
                        <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}