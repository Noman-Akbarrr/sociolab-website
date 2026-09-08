import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const founders = [
  {
    name: "Noman Akbar Khan",
    role: "Co-Founder & Performance Marketer",
    bio: "Specializing in algorithmic Meta Ads architectures, automated creator outreach systems (n8n), and conversion funnel mechanics. Direct oversight over all media spend and technical attribution.",
    linkedin: "https://linkedin.com/in/noman-akbar-khan",
    email: "noman@sociolab.com.pk",
  },
  {
    name: "Khizar",
    role: "Co-Founder & Creative Director",
    bio: "Leading visual identity, high-converting direct-response video production, and creator storytelling. Focused on turning passive scrollers into committed buyers.",
    linkedin: "https://linkedin.com/in/khizar",
    portfolio: "https://khizar.design",
  },
];

export function Founders() {
  return (
    <section className="bg-[#090D16]">
      <Section>
        <Reveal>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#FF5500] mb-4">
              Leadership
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
              Accountable Leadership. Direct Strategy.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-0 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="flex flex-col gap-5 py-10 md:px-8 md:py-0 border-[#1E293B] border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0">
                <div>
                  <h3 className="text-xl font-bold text-white">{f.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#FF5500]">{f.role}</p>
                </div>
                <p className="text-[15px] leading-relaxed text-[#94A3B8]">{f.bio}</p>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#CBD5E1] transition-colors hover:text-[#FF5500]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  {"email" in f && f.email && (
                    <a
                      href={`mailto:${f.email}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[#CBD5E1] transition-colors hover:text-[#FF5500]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      Email
                    </a>
                  )}
                  {"portfolio" in f && f.portfolio && (
                    <a
                      href={f.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#CBD5E1] transition-colors hover:text-[#FF5500]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}
