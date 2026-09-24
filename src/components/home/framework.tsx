const stages = [
  {
    num: "01",
    title: "Discovery & Audit",
    summary:
      "We analyze your current online presence, competitors, and target audience to find opportunities.",
    icon: "bx bx-search",
  },
  {
    num: "02",
    title: "Strategy & Planning",
    summary:
      "A custom growth plan across ads, social media, and web — tailored to your goals and budget.",
    icon: "bx bx-layout",
  },
  {
    num: "03",
    title: "Execute & Launch",
    summary:
      "Campaigns go live, content starts posting, and your new website goes live — all at once.",
    icon: "bx bx-rocket",
  },
  {
    num: "04",
    title: "Optimize & Scale",
    summary:
      "Weekly reporting, A/B testing, and scaling what works — we keep improving every month.",
    icon: "bx bx-trending-up",
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
              key={stage.num}
              className="p-6 rounded-xl flex flex-col justify-between transition-all"
              style={{ backgroundColor: "#292524", border: "1px solid #44403C" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <i className={`${stage.icon} text-2xl`} style={{ color: "#FF5500" }} />
                  <span className="font-mono text-sm font-bold" style={{ color: "#FF5500" }}>
                    {stage.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
                  {stage.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A8A29E" }}>
                  {stage.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
