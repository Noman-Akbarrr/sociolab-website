const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Strategic Positioning & Messaging",
    headline: "Category Creation & Competitive Framing",
    paragraph:
      "Crafting the executive narrative that establishes your platform as an essential strategic investment rather than a discretionary operational cost.",
    bullets: [
      "Value proposition architecture",
      "Executive pitch decks",
      "Buyer persona mapping",
      "Competitive battlecards",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Full-Funnel Demand Generation & ABM",
    headline: "High-Intent Account Acquisition",
    paragraph:
      "Building multi-channel demand engines that surround buying committees across LinkedIn, search, and targeted programmatic channels.",
    bullets: [
      "Account-based advertising (ABM)",
      "Paid search capture",
      "High-intent content syndication",
      "Retargeting sequences",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Creative & High-Conversion Digital Systems",
    headline: "Enterprise Digital Experiences",
    paragraph:
      "High-craft B2B digital experiences engineered to educate, de-risk, and convert serious enterprise procurement leaders.",
    bullets: [
      "Conversion-optimized websites",
      "Interactive product tours",
      "Sales enablement collateral",
      "Video case studies",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "RevOps, CRM & Pipeline Telemetry",
    headline: "Funnel Architecture & Closed-Loop Attribution",
    paragraph:
      "Connecting marketing attribution directly to Salesforce/HubSpot deal stages to ensure zero leakage between SDRs and AEs.",
    bullets: [
      "Lifecycle stage gating",
      "Sales SLA agreements",
      "Pipeline velocity tracking",
      "Executive board dashboards",
    ],
  },
];

export function Capabilities() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
            [ Scope &amp; Capabilities ]
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Four Disciplines. One Cohesive Revenue Engine.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-[#12151C] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {pillar.headline}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {pillar.paragraph}
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {pillar.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
