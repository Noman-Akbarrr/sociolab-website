const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
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
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    headline: "Analytics & Tracking",
    paragraph:
      "Crystal-clear attribution so you know exactly which campaigns drive revenue — no more guessing or wasting budget.",
    bullets: [
      "GA4 Event Setup",
      "Server-Side Tracking",
      "UTM Taxonomy & Reporting",
      "Weekly Performance Dashboards",
    ],
  },
];

export function Capabilities() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#1C1917" }}>
            Four Services. One Growth Engine.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.headline}
              className="bg-white border border-stone-200 p-6 rounded-xl transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDBA74", color: "#FF5500" }}>
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1C1917" }}>
                {pillar.headline}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#57534E" }}>
                {pillar.paragraph}
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {pillar.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
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
