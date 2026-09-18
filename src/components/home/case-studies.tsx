const caseStudies = [
  {
    title: "Repositioning Complex Security Infrastructure for Enterprise CISOs.",
    paragraph:
      "Client had strong technical adoption among developers but failed to close multi-year enterprise contracts. We restructured their narrative around corporate risk reduction and launched a targeted Tier-1 ABM engine.",
    metrics: [
      { value: "+$8.4M", color: "#1C1917", label: "Net-New Pipeline" },
      { value: "+41%", color: "#059669", label: "Average Deal Size" },
      { value: "-38 Days", color: "#FF5500", label: "Sales Cycle Drag" },
    ],
    quote:
      "\"Socio Lab gave our sales leadership the exact narrative weapon needed to close $100k+ enterprise contracts.\"",
    author: "David Sterling, Chief Commercial Officer",
  },
  {
    title: "Scaling Pipeline Velocity for a Complex B2B Payments Platform.",
    paragraph:
      "Client struggled with long sales cycles and inconsistent pipeline generation. We deployed a full-funnel ABM system targeting CFOs and VPs of Finance at mid-market enterprises.",
    metrics: [
      { value: "+$5.2M", color: "#1C1917", label: "Net-New Pipeline" },
      { value: "+67%", color: "#059669", label: "SQL Conversion Rate" },
      { value: "-21 Days", color: "#FF5500", label: "Sales Cycle Drag" },
    ],
    quote:
      "\"The pipeline consistency we now have is something we've never achieved before. Every board meeting, we can predict revenue.\"",
    author: "Sarah Chen, Chief Revenue Officer",
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12" style={{ color: "#1C1917" }}>
          Board-Level Commercial Outcomes
        </h2>

        <div className="space-y-12">
          {caseStudies.map((cs) => (
            <div
              key={cs.title}
              className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left: Visual placeholder */}
              <div className="lg:col-span-6">
                <div className="aspect-[16/10] bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74" }}>
                      <svg className="w-8 h-8" style={{ color: "#FF5500" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "#A8A29E" }}>
                      Enterprise Deliverable
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="lg:col-span-6">
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#1C1917" }}>
                  {cs.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#57534E" }}>
                  {cs.paragraph}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 py-4 mb-6" style={{ borderTop: "1px solid #E7E5E4", borderBottom: "1px solid #E7E5E4" }}>
                  {cs.metrics.map((m) => (
                    <div key={m.label}>
                      <span className="text-2xl font-bold font-mono" style={{ color: m.color }}>
                        {m.value}
                      </span>
                      <span className="block text-xs mt-1" style={{ color: "#78716C" }}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="pl-4" style={{ borderLeft: "2px solid #FF5500" }}>
                  <p className="text-xs italic mb-2" style={{ color: "#44403C" }}>
                    {cs.quote}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: "#1C1917" }}>
                    {cs.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
