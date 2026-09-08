import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CheckIcon, XIcon } from "@/components/icons";

type ComparisonRow = {
  feature: string;
  typical: string | boolean;
  sociolab: string | boolean;
};

export function ComparisonTable({
  eyebrow,
  title,
  subtitle,
  rows,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rows: ComparisonRow[];
}) {
  return (
    <Section>
      <Reveal>
        <div className="max-w-3xl mb-12">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white leading-[1.1]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="py-4 pr-4 text-sm font-semibold text-muted uppercase tracking-wide">
                  Feature
                </th>
                <th className="py-4 px-4 text-sm font-semibold text-muted uppercase tracking-wide">
                  Typical Agency
                </th>
                <th className="py-4 pl-4 text-sm font-semibold text-brand uppercase tracking-wide">
                  Sociolab
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="py-5 pr-4 text-[15px] font-semibold text-white">
                    {row.feature}
                  </td>
                  <td className="py-5 px-4">
                    <CellValue value={row.typical} muted />
                  </td>
                  <td className="py-5 pl-4">
                    <CellValue value={row.sociolab} accent />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

function CellValue({
  value,
  muted = false,
  accent = false,
}: {
  value: string | boolean;
  muted?: boolean;
  accent?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckIcon className={`size-5 ${accent ? "text-brand" : "text-muted"}`} />
    ) : (
      <XIcon className="size-5 text-muted/40" />
    );
  }
  return (
    <span
      className={`text-[15px] leading-relaxed ${
        accent ? "text-white font-medium" : "text-muted"
      }`}
    >
      {value}
    </span>
  );
}
