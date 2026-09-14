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
    <section className="py-24 md:py-32" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#FF5500" }}>
            [ Repeatable Methodology ]
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#FFFFFF" }}>
            The 4-Stage GTM Architecture Engine
          </h2>
          <p className="text-center max-w-2xl mx-auto text-base" style={{ color: "#A8A29E" }}>
            We replace ad-hoc marketing tactics with a disciplined, institutional framework engineered for enterprise sales cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.number}
              className="p-6 rounded-xl flex flex-col justify-between transition-all"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C" }}
            >
              <div>
                <span className="text-xs font-mono tracking-wider mb-4 block" style={{ color: "#FF5500" }}>
                  Stage // {stage.number}
                </span>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
                  {stage.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A29E" }}>
                  {stage.summary}
                </p>
              </div>
              <ul className="space-y-2">
                {stage.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs" style={{ color: "#D6D3D1" }}>{bullet}</span>
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
