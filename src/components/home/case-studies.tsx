const caseStudies = [
  {
    meta: "Series B Enterprise SaaS // $28M ARR",
    title: "Repositioning Complex Security Infrastructure for Enterprise CISOs.",
    paragraph:
      "Client had strong technical adoption among developers but failed to close multi-year enterprise contracts. We restructured their narrative around corporate risk reduction and launched a targeted Tier-1 ABM engine.",
    metrics: [
      { value: "+$8.4M", color: "text-white", label: "Net-New Pipeline" },
      { value: "+41%", color: "text-emerald-400", label: "Average Deal Size" },
      { value: "-38 Days", color: "text-blue-400", label: "Sales Cycle Drag" },
    ],
    quote:
      "\"Socio Lab gave our sales leadership the exact narrative weapon needed to close $100k+ enterprise contracts.\"",
    author: "David Sterling, Chief Commercial Officer",
  },
  {
    meta: "Scale-Up Fintech // $12M ARR",
    title: "Scaling Pipeline Velocity for a Complex B2B Payments Platform.",
    paragraph:
      "Client struggled with long sales cycles and inconsistent pipeline generation. We deployed a full-funnel ABM system targeting CFOs and VPs of Finance at mid-market enterprises.",
    metrics: [
      { value: "+$5.2M", color: "text-white", label: "Net-New Pipeline" },
      { value: "+67%", color: "text-emerald-400", label: "SQL Conversion Rate" },
      { value: "-21 Days", color: "text-blue-400", label: "Sales Cycle Drag" },
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
        <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ Proven Telemetry ]
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          Board-Level Commercial Outcomes
        </h2>

        <div className="space-y-12">
          {caseStudies.map((cs) => (
            <div
              key={cs.title}
              className="bg-[#12151C] border border-white/10 rounded-2xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left: Visual placeholder */}
              <div className="lg:col-span-6">
                <div className="aspect-[16/10] bg-[#181C26] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                    </div>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      Enterprise Deliverable
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="lg:col-span-6">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                  {cs.meta}
                </p>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {cs.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {cs.paragraph}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-4 mb-6">
                  {cs.metrics.map((m) => (
                    <div key={m.label}>
                      <span className={`text-2xl font-bold font-mono ${m.color}`}>
                        {m.value}
                      </span>
                      <span className="block text-xs text-slate-400 mt-1">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-xs italic text-slate-300 mb-2">
                    {cs.quote}
                  </p>
                  <p className="text-xs font-semibold text-white">
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
