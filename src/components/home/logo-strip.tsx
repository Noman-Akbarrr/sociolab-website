export function LogoStrip() {
  const logos = [
    "CloudScale Data",
    "Veritas Cyber",
    "NexGen PSX",
    "Apex Systems",
    "Synthetix Labs",
    "Kinetix Logistics",
  ];

  return (
    <section className="border-y border-white/5 py-10">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
          Trusted by revenue & marketing leaders across enterprise &amp; scale-up B2B
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold text-white/40 hover:text-white/80 transition-all cursor-default grayscale hover:grayscale-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
