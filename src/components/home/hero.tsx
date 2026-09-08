import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const trustPoints = [
  "100% Confidential",
  "Clear 30-Day Roadmaps",
  "No Deliverable Fluff",
];

const logos = [
  { name: "Exact Fashion Store", width: "w-28" },
  { name: "Sehgal Motors", width: "w-24" },
  { name: "GCC Startups", width: "w-24" },
  { name: "Tanzeem", width: "w-20" },
  { name: "Quran Academy", width: "w-24" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#090D16]">
      <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Reveal>
          <div className="max-w-4xl">
            {/* ── Badge ────────────────────────────── */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,85,0,0.25)] bg-[rgba(255,85,0,0.1)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FF5500]">
              Paid Acquisition + Direct-Response Creative
            </span>

            {/* ── Headline ─────────────────────────── */}
            <h1 className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Stop Burning Ad Spend.
              <br />
              Scale{" "}
              <span className="text-[#FF5500]">Profitable Revenue</span>{" "}
              with Performance Media.
            </h1>

            {/* ── Subheadline ──────────────────────── */}
            <p className="mt-7 max-w-[720px] text-lg leading-relaxed text-[#CBD5E1] sm:text-xl">
              We engineer predictable growth engines for e-commerce and scaling brands.
              By combining direct-response creative production, automated creator
              partnerships, and algorithmic Meta &amp; Google ads, we lower your
              acquisition costs and scale your bottom line.
            </p>

            {/* ── CTA Cluster ──────────────────────── */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#audit-form"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#E04B00] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5500]"
              >
                Get a Free Acquisition Audit
              </a>
              <a
                href="#case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#334155] bg-transparent px-7 py-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.05)] hover:text-[#FF5500]"
              >
                View Client Results
              </a>
            </div>

            {/* ── Trust micro-copy ─────────────────── */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {trustPoints.map((point) => (
                <span
                  key={point}
                  className="flex items-center gap-1.5 text-sm text-[#94A3B8]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4 text-[#FF5500]"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {point}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      {/* ── Social Proof Bar ─────────────────────── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-10 sm:py-12">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#64748B]">
            Trusted by ambitious regional &amp; growing brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className={`flex items-center text-sm font-semibold tracking-wide text-[#475569] transition-colors hover:text-white ${logo.width}`}
              >
                {logo.name}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
