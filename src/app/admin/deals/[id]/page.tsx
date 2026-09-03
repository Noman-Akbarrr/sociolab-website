import { notFound } from "next/navigation";
import Link from "next/link";
import * as store from "@/lib/crm-store";

export const metadata = {
  title: "Deal | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = store.getDeal(id);
  const stages = store.getStages();

  if (!deal) notFound();

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  return (
    <div className="px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/deals" className="text-sm text-ink/50 hover:underline">&larr; Back to Deals</Link>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">{deal.title}</h1>
        </div>
        <select
          defaultValue={deal.stageId}
          onChange={(e) => fetch(`/admin/api/crm/deals/${deal.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stageId: e.target.value }) }).then(() => window.location.reload())}
          className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
        >
          {stages.map((s: any) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-[3px] border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/admin/clients/${deal.company.id}`} className="font-display text-lg font-semibold text-ink hover:text-brand">
                  {deal.company.name}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink/50">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em]"
                    style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}>
                    {deal.stage.label}
                  </span>
                  <span>Value: <span className="font-semibold text-brand">{formatCurrency(deal.value)}</span></span>
                  <span>Probability: <span className="font-semibold">{deal.probability}%</span></span>
                  {deal.expectedClose && <span>Close: <span className="font-semibold">{new Date(deal.expectedClose).toLocaleDateString()}</span></span>}
                </div>
              </div>
              <div className="text-right text-sm text-ink/50">
                <div>Owner: {deal.owner.name}</div>
                <div>Created: {new Date(deal.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">Activity</h2>
            </div>
            <div className="divide-y divide-line">
              {deal.activities.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No activity yet.</p>
              ) : (
                deal.activities.map((activity: any) => (
                  <div key={activity.id} className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="font-display text-sm font-semibold text-ink">{activity.subject}</span>
                        <div className="flex items-center gap-2 text-xs text-ink/50 mt-1">
                          <span>{activity.user.name}</span>
                          <span>&middot;</span>
                          <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">{activity.type.replace(/-/g, " ")}</span>
                    </div>
                    {activity.body && <p className="text-sm text-ink/60 mt-2">{activity.body}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-ink/50">Value</dt><dd className="font-display text-xl font-semibold text-brand">{formatCurrency(deal.value)}</dd></div>
              <div><dt className="text-ink/50">Probability</dt><dd className="font-semibold">{deal.probability}%</dd></div>
              <div><dt className="text-ink/50">Weighted</dt><dd className="font-display text-xl font-semibold text-brand">{formatCurrency(Math.round(deal.value * deal.probability / 100))}</dd></div>
              {deal.expectedClose && <div><dt className="text-ink/50">Expected Close</dt><dd className="font-semibold">{new Date(deal.expectedClose).toLocaleDateString()}</dd></div>}
            </dl>
          </div>

          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Actions</h3>
            <div className="flex flex-col gap-2">
              {deal.projects.length === 0 && deal.stage.isWon && (
                <button onClick={async () => { await fetch("/admin/api/crm/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: deal.title, companyId: deal.companyId, dealId: deal.id, budget: deal.value }) }); window.location.reload(); }}
                  className="rounded-[3px] bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                  Convert to Project
                </button>
              )}
              {deal.projects.length > 0 && (
                <Link href={`/admin/clients/${deal.company.id}`} className="rounded-[3px] border border-line px-3 py-2 text-sm font-medium text-ink text-center hover:border-brand">
                  View Project
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Add Note</h3>
            <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); await fetch("/admin/api/crm/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "note", subject: "Note added", body: fd.get("body"), dealId: deal.id }) }); window.location.reload(); }} className="flex flex-col gap-2">
              <textarea name="body" rows={3} required className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand resize-none" placeholder="Add a note..." />
              <button type="submit" className="rounded-[3px] bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">Add Note</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
