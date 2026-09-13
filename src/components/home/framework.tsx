const stages = [
  {
    number: "01",
    title: "Strategic Diagnostic & ICP Calibration",
    summary:
      "Rigorous forensic audit of existing customer data, win/loss interviews, and pipeline leakage.",
    bullets: [
      "Executive Stakeholder Interviews",
      "Customer Journey & Deal Leakage Audit",
      "ICP Tiering & Disqualification Matrix",
    ],
  },
  {
    number: "02",
    title: "Category Framing & Narrative Architecture",
    summary:
      "Translating complex technical capabilities into an undeniable commercial executive narrative.",
    bullets: [
      "Enterprise Positioning Playbook",
      "High-Converting Sales Pitch Deck",
      "Category Creation & Competitive Moat Guide",
    ],
  },
  {
    number: "03",
    title: "Demand Generation & ABM Infrastructure",
    summary:
      "Building the programmatic outbound and inbound acquisition engine targeting Tier-1 accounts.",
    bullets: [
      "Multi-Touch Account-Based Marketing (ABM)",
      "High-Intent Search & Paid Distribution",
      "High-Craft Digital Conversion Assets",
    ],
  },
  {
    number: "04",
    title: "Revenue Operations & Attribution Telemetry",
    summary:
      "Integrating marketing signals directly with CRM stages to monitor pipeline velocity and ARR.",
    bullets: [
      "CRM Funnel Stage Gating & SLAs",
      "Multi-Touch Revenue Attribution",
      "Bi-Weekly Optimization & Pipeline Sprints",
    ],
  },
];

export function Framework() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
            [ Repeatable Methodology ]
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            The 4-Stage GTM Architecture Engine
          </h2>
          <p className="text-center text-slate-400 max-w-2xl mx-auto text-base">
            We replace ad-hoc marketing tactics with a disciplined, institutional framework engineered for enterprise sales cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.number}
              className="bg-[#12151C] border border-white/10 p-6 rounded-xl flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <span className="text-xs font-mono text-blue-400 tracking-wider mb-4 block">
                  Stage // {stage.number}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  {stage.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {stage.summary}
                </p>
              </div>
              <ul className="space-y-2">
                {stage.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300">{bullet}</span>
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
