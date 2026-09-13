export function StrategicThesis() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Column — Sticky */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
            [ The Structural Flaw ]
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
            Most B2B enterprises don&apos;t have a lead problem. They have a positioning and velocity problem.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Traditional marketing agencies flood your CRM with low-intent MQLs that your sales team immediately discards. Meanwhile, pure brand consultancies deliver high-level slides that fail to generate pipeline. Socio Lab closes the chasm between brand narrative and closed-won ARR.
          </p>
        </div>

        {/* Right Column — Comparison Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1 */}
          <div className="bg-[#12151C] border border-white/10 p-6 rounded-xl">
            <span className="text-red-400 font-mono text-xs uppercase tracking-wider">
              Conventional Agency Approach
            </span>
            <h3 className="text-lg font-semibold text-white mt-2 mb-2">
              Creative vanity metrics without sales alignment.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pretty designs and awareness campaigns that win aesthetic awards, but leave enterprise SDRs and AEs without high-intent buyer conversations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#12151C] border border-white/10 p-6 rounded-xl">
            <span className="text-red-400 font-mono text-xs uppercase tracking-wider">
              Performance Agency Approach
            </span>
            <h3 className="text-lg font-semibold text-white mt-2 mb-2">
              Spamming inboxes and bidding on generic keywords.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Burning brand reputation with automated cold sequences and high-CAC paid campaigns that produce inflated lead counts with near-zero conversion to Stage 3 pipeline.
            </p>
          </div>

          {/* Card 3 — The Socio Lab Standard */}
          <div className="bg-gradient-to-br from-[#161B26] to-[#12151C] border border-blue-500/30 p-6 rounded-xl relative">
            <span className="text-blue-400 font-mono text-xs uppercase tracking-wider font-semibold">
              The Socio Lab Architecture
            </span>
            <h3 className="text-lg font-semibold text-white mt-2 mb-2">
              Integrated GTM: Narrative, Demand, and Pipeline Telemetry.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We build full-funnel systems where enterprise positioning informs targeted ABM acquisition, directly measured by sales acceptance rates and deal acceleration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
