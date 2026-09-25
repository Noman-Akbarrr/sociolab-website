const stages = [
  {
    title: "Discovery & Strategy",
    summary:
      "We analyze your current online presence, competitors, and target audience to build a custom growth plan.",
    bullets: [
      "Competitor & Audience Research",
      "Current Presence Audit",
      "Custom Growth Strategy",
    ],
  },
  {
    title: "Creative & Content",
    summary:
      "We design and create all the assets you need — from ad creatives to social media content to your website.",
    bullets: [
      "Ad Creatives & Copywriting",
      "Social Media Content Calendar",
      "Website & Landing Page Design",
    ],
  },
  {
    title: "Launch & Campaigns",
    summary:
      "Everything goes live — ad campaigns, social media content, and your website. We monitor daily.",
    bullets: [
      "Meta & Google Ads Launch",
      "Social Media Goes Live",
      "Website Deployment",
    ],
  },
  {
    title: "Optimize & Scale",
    summary:
      "Weekly reporting, A/B testing, and scaling what works — we keep improving every month.",
    bullets: [
      "Weekly Performance Reports",
      "A/B Testing & Optimization",
      "Scaling Winning Campaigns",
    ],
  },
];

export function Framework() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#FFFFFF" }}>
            How We Work
          </h2>
          <p className="text-center max-w-2xl mx-auto text-base" style={{ color: "#A8A29E" }}>
            A simple, proven process that gets results — no complicated frameworks, no jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
              <div
              key={stages.indexOf(stage)}
              className="p-6 rounded-xl flex flex-col justify-between transition-all"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C" }}
            >
              <div>
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
