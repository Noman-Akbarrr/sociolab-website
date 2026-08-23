const defaults = [
  "ATTENTION IS THE NEW CURRENCY",
  "TREND-NATIVE",
  "SOCIAL MEDIA",
  "DIGITAL MARKETING",
  "WEB DEVELOPMENT",
  "FROM TREND TO WHATSAPP",
  "ONE TEAM",
  "GROWTH",
];

export function Marquee({ items = defaults }: { items?: string[] }) {
  const loop = [...items, ...items];
  return (
    <div
      className="overflow-hidden border-y-2 border-ink bg-brand py-3 text-white"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.14em]">
              {item}
            </span>
            <span className="text-lg leading-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}