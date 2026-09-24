const services = [
  {
    icon: "bx bx-target-lock",
    headline: "Performance Marketing",
    paragraph:
      "Data-driven Meta and Google ad campaigns engineered to acquire customers at a profitable cost. We handle everything from strategy to creative to optimization.",
    bullets: [
      "Meta & Instagram Ads",
      "Google Search & Shopping",
      "Retargeting Campaigns",
      "Conversion Tracking (CAPI)",
    ],
  },
  {
    icon: "bx bx-social-network",
    headline: "Social Media Management",
    paragraph:
      "Strategic content creation, community management, and growth across Instagram, Facebook, and TikTok — turning followers into customers.",
    bullets: [
      "Content Strategy & Calendar",
      "Reels & Short-Form Video",
      "Community Management",
      "Analytics & Reporting",
    ],
  },
  {
    icon: "bx bx-code-alt",
    headline: "Web Development",
    paragraph:
      "High-converting websites, landing pages, and e-commerce stores built to turn your traffic into paying customers.",
    bullets: [
      "Landing Pages & Funnels",
      "E-Commerce Websites",
      "Speed & SEO Optimization",
      "Conversion-Focused Design",
    ],
  },
];

export function Capabilities() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#1C1917" }}>
            Three Services. One Growth Engine.
          </h2>
          <p className="text-center max-w-2xl mx-auto text-base" style={{ color: "#57534E" }}>
            Everything your brand needs to grow online — from ads to content to websites — all under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.headline}
              className="bg-white border border-stone-200 p-6 rounded-xl transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74", color: "#FF5500" }}>
                <i className={`${service.icon} text-2xl`} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1C1917" }}>
                {service.headline}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#57534E" }}>
                {service.paragraph}
              </p>
              <ul className="space-y-2">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <i className="bx bx-check text-sm mt-0.5 flex-shrink-0" style={{ color: "#FF5500" }} />
                    <span className="text-xs" style={{ color: "#44403C" }}>{b}</span>
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
