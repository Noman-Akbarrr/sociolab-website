const phases = [
  {
    period: "Days 1–30",
    title: "Diagnose & Architect",
    summary: "Comprehensive technical, positioning, and data audit.",
    bullets: [
      "Stakeholder interviews",
      "CRM tracking check",
      "Initial quick-win deployment",
    ],
  },
  {
    period: "Days 31–60",
    title: "Build & Calibrate",
    summary: "Asset production and infrastructure deployment.",
    bullets: [
      "Core narrative sign-off",
      "ABM campaign staging",
      "Digital conversion asset rollout",
    ],
  },
  {
    period: "Days 61–90",
    title: "Activate & Accelerate",
    summary: "Live market activation and bi-weekly revenue sprints.",
    bullets: [
      "Pipeline ramp-up",
      "Bi-weekly CRO reporting",
      "Active sales enablement feedback loops",
    ],
  },
];

export function Onboarding() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ Seamless Integration ]
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          How We Integrate: Zero Operational Drag
        </h2>
        <p className="text-slate-400 max-w-xl text-base mb-12">
          Enterprise teams cannot afford months of hand-holding. Here is our exact, sprint-based onboarding framework:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.period}
              className="bg-[#12151C] border border-white/10 p-6 rounded-xl"
            >
              <span className="text-xs font-mono text-blue-400 tracking-wider">
                {phase.period}
              </span>
              <h3 className="text-sm font-semibold text-white mt-2 mb-3">
                {phase.title}: {phase.summary}
              </h3>
              <ul className="space-y-2">
                {phase.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SLA Trust Banner */}
        <div className="mt-8 p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col md:flex-row justify-between items-center text-xs text-slate-300 gap-4">
          <span>
            Dedicated Enterprise Slack Channel // Async Weekly Video Briefings // Bi-Weekly Executive Sprints
          </span>
          <span className="text-blue-400 font-semibold whitespace-nowrap">
            Guaranteed 4-Hour Response SLA
          </span>
        </div>
      </div>
    </section>
  );
}
