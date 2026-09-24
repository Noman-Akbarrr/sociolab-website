export function StrategicThesis() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Column — Sticky */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6" style={{ color: "#1C1917" }}>
            Most businesses don&apos;t have a product problem. They have a visibility and conversion problem.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#57534E" }}>
            You&apos;re great at what you do — but your competitors are showing up everywhere your customers look. Without the right strategy, you&apos;re invisible online while others capture your audience.
          </p>
        </div>

        {/* Right Column — Comparison Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1 */}
          <div className="bg-white border border-stone-200 p-6 rounded-xl">
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "#DC2626" }}>
              Posting Without Strategy
            </span>
            <h3 className="text-lg font-semibold mt-2 mb-2" style={{ color: "#1C1917" }}>
              Random content with no clear plan.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
              Posting when you feel like it, no content calendar, no audience targeting. You get a few likes but zero leads or sales.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-stone-200 p-6 rounded-xl">
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "#DC2626" }}>
              Hiring Expensive Agencies
            </span>
            <h3 className="text-lg font-semibold mt-2 mb-2" style={{ color: "#1C1917" }}>
              Big retainers with no accountability.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
              You pay PKR 100K+ per month and get vague reports about &quot;impressions&quot; and &quot;reach&quot; — but no actual customers or revenue growth.
            </p>
          </div>

          {/* Card 3 — The Sociolab Standard */}
          <div className="p-6 rounded-xl relative" style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)", border: "1px solid #FDBA74" }}>
            <span className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: "#FF5500" }}>
              The Sociolab Approach
            </span>
            <h3 className="text-lg font-semibold mt-2 mb-2" style={{ color: "#1C1917" }}>
              Data-driven growth across ads, social, and web.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#44403C" }}>
              We combine performance marketing, strategic social media, and high-converting websites — all measured by real business results, not vanity metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
