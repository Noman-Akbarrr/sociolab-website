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
    icon: "bx bx-search-alt",
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
    icon: "bx bx-pencil",
  },
  {
    period: "Week 3",
    title: "Launch & Go Live",
    summary: "Everything goes live — campaigns, content, and your website.",
    bullets: [
      "Campaign launch & monitoring",
      "First content published",
      "Website goes live",
    ],
    icon: "bx bx-rocket",
  },
  {
    period: "Week 4",
    title: "Report & Optimize",
    summary: "First performance report and optimization round based on real data.",
    bullets: [
      "Performance report delivery",
      "A/B test analysis",
      "Scaling strategy for next month",
    ],
    icon: "bx bx-bar-chart-alt-2",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.period}
              className="p-6 rounded-xl"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <i className={`${phase.icon} text-xl`} style={{ color: "#FF5500" }} />
                <span className="text-xs font-mono tracking-wider font-semibold" style={{ color: "#FF5500" }}>
                  {phase.period}
                </span>
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "#FFFFFF" }}>
                {phase.title}
              </h3>
              <p className="text-xs mb-4" style={{ color: "#A8A29E" }}>
                {phase.summary}
              </p>
              <ul className="space-y-2">
                {phase.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <i className="bx bx-check text-xs mt-0.5 flex-shrink-0" style={{ color: "#FF5500" }} />
                    <span className="text-xs" style={{ color: "#D6D3D1" }}>{b}</span>
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
