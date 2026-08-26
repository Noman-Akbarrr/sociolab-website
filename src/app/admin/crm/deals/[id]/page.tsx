import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Deal | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getDeal(id: string) {
  return prisma.deal.findUnique({
    where: { id },
    include: {
      company: true,
      stage: true,
      owner: { select: { id: true, name: true } },
      contacts: { include: { contact: true } },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      projects: { orderBy: { createdAt: "desc" } },
    },
  });
}

async function getStages() {
  return prisma.pipelineStage.findMany({ orderBy: { order: "asc" } });
}

async function getCompanyContacts(companyId: string) {
  return prisma.contact.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
}

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const [deal, stages, contacts] = await Promise.all([getDeal(id), getStages(), getCompanyContacts((await getDeal(id))?.companyId || "")]);

  if (!deal) notFound();

  const formatCurrency = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/crm/deals" className="text-sm text-ink/50 hover:underline">&larr; Back to Deals</Link>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{deal.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            defaultValue={deal.stageId}
            onChange={(e) => fetch(`/admin/api/crm/deals/${deal.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stageId: e.target.value }) }).then(() => window.location.reload())}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            {stages.map((s: any) => (
              <option key={s.id} value={s.id} style={{ color: s.color }}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Deal Header */}
          <div className="flex flex-col gap-4 rounded-[3px] border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/admin/crm/companies/${deal.company.id}`} className="font-display text-lg font-semibold text-ink hover:text-brand">
                  {deal.company.name}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/50">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                    deal.stage.isWon ? "bg-green-100 text-green-700" : deal.stage.isClosed ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`} style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}>
                    {deal.stage.label}
                  </span>
                  <span>Value: <span className="font-semibold text-brand">{formatCurrency(deal.value)}</span></span>
                  <span>Probability: <span className="font-semibold">{deal.probability}%</span></span>
                  {deal.expectedClose && <span>Expected Close: <span className="font-semibold">{new Date(deal.expectedClose).toLocaleDateString()}</span></span>}
                  {deal.closedAt && <span>Closed: <span className="font-semibold">{new Date(deal.closedAt).toLocaleDateString()}</span></span>}
                </div>
              </div>
              <div className="text-right text-sm text-ink/50">
                <div>Owner: {deal.owner.name}</div>
                <div>Created: {new Date(deal.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Contacts */}
            {deal.contacts.length > 0 && (
              <div className="pt-4 border-t border-line">
                <h3 className="font-display text-sm font-semibold text-ink mb-2">Contacts</h3>
                <div className="flex flex-wrap gap-2">
                  {deal.contacts.map((dc: any) => (
                    <Link key={dc.contact.id} href={`/admin/crm/contacts/${dc.contact.id}`} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-sm text-ink hover:bg-mist/80">
                      {dc.contact.firstName} {dc.contact.lastName}
                      {dc.contact.email && <span className="text-ink/50">({dc.contact.email})</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="flex flex-col gap-4 rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">Activity</h2>
            </div>
            <div className="divide-y divide-line">
              {deal.activities.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No activity yet.</p>
              ) : (
                deal.activities.map((activity: any) => (
                  <div key={activity.id} className="flex flex-col gap-1 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-display text-sm font-semibold text-ink">{activity.subject}</span>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                          <span className="font-mono">{activity.user.name}</span>
                          <span>·</span>
                          <span>{new Date(activity.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">{activity.type.replace(/-/g, " ")}</span>
                    </div>
                    {activity.body && <p className="text-sm text-ink/60">{activity.body}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Deal Info */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Deal Details</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-ink/50">Value</dt>
                <dd className="font-display text-xl font-semibold text-brand">{formatCurrency(deal.value)}</dd>
              </div>
              <div>
                <dt className="text-ink/50">Probability</dt>
                <dd className="font-semibold">{deal.probability}%</dd>
              </div>
              <div>
                <dt className="text-ink/50">Weighted Value</dt>
                <dd className="font-display text-xl font-semibold text-brand">{formatCurrency(Math.round(deal.value * deal.probability / 100))}</dd>
              </div>
              {deal.expectedClose && (
                <div>
                  <dt className="text-ink/50">Expected Close</dt>
                  <dd className="font-semibold">{new Date(deal.expectedClose).toLocaleDateString()}</dd>
                </div>
              )}
              {deal.lostReason && (
                <div>
                  <dt className="text-ink/50">Lost Reason</dt>
                  <dd className="font-semibold text-red-600">{deal.lostReason}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link href={`/admin/crm/deals/${deal.id}/edit`} className="rounded-[3px] border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-mist">
                Edit Deal
              </Link>
              {deal.projects.length === 0 && deal.stage.isWon && (
                <button onClick={async () => { await fetch(`/admin/api/crm/projects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: deal.title, companyId: deal.companyId, dealId: deal.id, budget: deal.value }) }); window.location.reload(); }} className="rounded-[3px] bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                  Convert to Project
                </button>
              )}
              {deal.projects.length > 0 && (
                <Link href={`/admin/crm/projects/${deal.projects[0].id}`} className="rounded-[3px] border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-mist">
                  View Project
                </Link>
              )}
            </div>
          </div>

          {/* Add Note Form */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Add Note</h3>
            <form onSubmit={async (e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); await fetch("/admin/api/crm/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "note", subject: "Note added", body: formData.get("body"), dealId: deal.id }) }); window.location.reload(); }} className="flex flex-col gap-2">
              <textarea name="body" rows={3} required className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" placeholder="Add a note..." />
              <button type="submit" className="rounded-[3px] bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">Add Note</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}