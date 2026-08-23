"use client";

const PRESETS = [
  { value: "#ff4d00", label: "Brand orange" },
  { value: "#ff6a1f", label: "Bright orange" },
  { value: "#0d0d0d", label: "Ink black" },
  { value: "#ffffff", label: "White" },
  { value: "#16a34a", label: "Green" },
  { value: "#2563eb", label: "Blue" },
  { value: "#7c3aed", label: "Purple" },
  { value: "#dc2626", label: "Red" },
  { value: "#ec4899", label: "Pink" },
];

export function ColorField({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const current = value || "#ff4d00";
  return (
    <div className="flex flex-col gap-2">
      {label ? <span className="text-xs font-semibold text-ink/70">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            title={preset.label}
            onClick={() => onChange(preset.value)}
            className={`grid size-7 place-items-center rounded-full border-2 ${
              current.toLowerCase() === preset.value.toLowerCase()
                ? "border-ink"
                : "border-line hover:border-ink/40"
            }`}
            style={{ backgroundColor: preset.value }}
            aria-label={preset.label}
          >
            {current.toLowerCase() === preset.value.toLowerCase() ? (
              <span
                className={`size-2 rounded-full ${
                  preset.value === "#ffffff" ? "bg-ink" : "bg-white"
                }`}
              />
            ) : null}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-[3px] border border-line">
          <span className="size-5 rounded-full" style={{ backgroundColor: current }} />
        </span>
        <input
          type="text"
          value={current}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          placeholder="#ff4d00"
          className="w-full rounded-[3px] border border-line bg-white px-3 py-2 font-mono text-xs text-ink outline-none placeholder:text-ink/35 focus:border-brand"
        />
      </div>
    </div>
  );
}