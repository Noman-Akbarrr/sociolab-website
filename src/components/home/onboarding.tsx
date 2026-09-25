const phases = [
  {
    period: "Week 1",
    title: "Discovery & Setup",
    summary: "Audit your current presence and set up everything needed to grow.",
    bullets: [
      "Competitor & audience research",
      "Ad account setup & tracking",
      "Content strategy creation",
    ],
  },
  {
    period: "Week 2",
    title: "Create & Build",
    summary: "Design and build all assets — from ad creatives to your website.",
    bullets: [
      "Ad creatives & copywriting",
      "Content calendar finalization",
      "Website or landing page build",
    ],
  },
  {
    period: "Week 3-4",
    title: "Launch & Optimize",
    summary: "Everything goes live and we start optimizing based on real data.",
    bullets: [
      "Campaign launch & monitoring",
      "First content published",
      "Performance report & optimization",
    ],
  },
];

export function Onboarding() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
          Your First 30 Days
        </h2>
        <p className="max-w-xl text-base mb-12" style={{ color: "#A8A29E" }}>
          From kickoff to results in 4 weeks. Here&apos;s exactly what happens:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.period}
              className="p-6 rounded-xl"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C" }}
            >
              <span className="text-xs font-mono tracking-wider" style={{ color: "#FF5500" }}>
                {phase.period}
              </span>
              <h3 className="text-sm font-semibold mt-2 mb-3" style={{ color: "#FFFFFF" }}>
                {phase.title}: {phase.summary}
              </h3>
              <ul className="space-y-2">
                {phase.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs" style={{ color: "#D6D3D1" }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-8 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center text-xs gap-4" style={{ backgroundColor: "rgba(255,85,0,0.08)", border: "1px solid rgba(255,85,0,0.2)", color: "#D6D3D1" }}>
          <span>
            Dedicated account manager, weekly check-ins, and transparent reporting — every step of the way.
          </span>
          <span className="font-semibold whitespace-nowrap" style={{ color: "#FF5500" }}>
            Guaranteed Response Within 24 Hours
          </span>
        </div>
      </div>
    </section>
  );
}
