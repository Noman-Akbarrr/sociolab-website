"use client";

export function LogoStrip() {
  const logos = [
    "Exact Fashion",
    "Sehgal Motors",
    "Tanzeem",
    "GCC Startups",
    "Local Brands",
    "E-Commerce Stores",
  ];

  return (
    <section className="py-10" style={{ borderTop: "1px solid #E7E5E4", borderBottom: "1px solid #E7E5E4" }}>
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <p className="text-center text-xs font-mono uppercase tracking-widest mb-8" style={{ color: "#A8A29E" }}>
          Trusted by brands across Pakistan and beyond
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold transition-all cursor-default"
              style={{ color: "#D6D3D1" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D6D3D1")}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
