import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Client | Sociolab Admin",
  robots: { index: false, follow: false },
};

async function getCompany(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { createdAt: "desc" } },
      deals: { include: { stage: true }, orderBy: { createdAt: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
      tickets: { include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompany(id);

  if (!company) notFound();

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  const openDeals = company.deals.filter((d) => !d.stage.isClosed);
  const wonDeals = company.deals.filter((d) => d.stage.isWon);
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="px-8 py-10">
      <div className="mb-6">
        <Link href="/admin/clients" className="text-sm text-ink/50 hover:underline">&larr; Back to Clients</Link>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">{company.name}</h1>
        {company.domain && <p className="text-sm text-ink/50">{company.domain}</p>}
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Pipeline Value</span>
          <div className="font-display text-2xl font-semibold text-brand">{formatCurrency(pipelineValue)}</div>
          <span className="text-xs text-ink/50">{openDeals.length} open deals</span>
        </div>
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Won Revenue</span>
          <div className="font-display text-2xl font-semibold text-green-600">{formatCurrency(wonValue)}</div>
          <span className="text-xs text-ink/50">{wonDeals.length} won</span>
        </div>
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Projects</span>
          <div className="font-display text-2xl font-semibold text-blue-600">{company.projects.length}</div>
        </div>
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Tickets</span>
          <div className="font-display text-2xl font-semibold text-orange-600">{company.tickets.length}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Deals */}
          <Section title={`Deals (${company.deals.length})`} href={`/admin/deals?companyId=${company.id}`}>
            {company.deals.length === 0 ? (
              <Empty>No deals yet.</Empty>
            ) : (
              company.deals.map((deal: any) => (
                <Link key={deal.id} href={`/admin/deals/${deal.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                  <div>
                    <span className="font-display text-sm font-semibold text-ink">{deal.title}</span>
                    <div className="flex items-center gap-2 text-xs text-ink/50 mt-1">
                      <span>{formatCurrency(deal.value)}</span>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase"
                        style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}>
                        {deal.stage.label}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </Section>

          {/* Projects */}
          <Section title={`Projects (${company.projects.length})`}>
            {company.projects.length === 0 ? (
              <Empty>No projects yet.</Empty>
            ) : (
              company.projects.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-4 hover:bg-mist/50">
                  <div>
                    <span className="font-display text-sm font-semibold text-ink">{project.name}</span>
                    <div className="flex items-center gap-2 text-xs text-ink/50 mt-1">
                      <span>{project.status}</span>
                      {project.budget && <span>{formatCurrency(project.budget)}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </Section>

          {/* Tickets */}
          <Section title={`Tickets (${company.tickets.length})`}>
            {company.tickets.length === 0 ? (
              <Empty>No tickets yet.</Empty>
            ) : (
              company.tickets.map((ticket: any) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 hover:bg-mist/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-brand">{ticket.number}</span>
                      <span className="font-display text-sm font-semibold text-ink">{ticket.subject}</span>
                    </div>
                    <span className="text-xs text-ink/50 mt-1">{ticket.status.replace("-", " ")}</span>
                  </div>
                </div>
              ))
            )}
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          {/* Details */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              {company.industry && <div><dt className="text-ink/50">Industry</dt><dd className="font-medium">{company.industry}</dd></div>}
              {company.size && <div><dt className="text-ink/50">Size</dt><dd className="font-medium">{company.size}</dd></div>}
              {company.website && <div><dt className="text-ink/50">Website</dt><dd><a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{company.website}</a></dd></div>}
              <div><dt className="text-ink/50">Created</dt><dd className="font-medium">{new Date(company.createdAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>

          {/* Contacts */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Contacts ({company.contacts.length})</h3>
            {company.contacts.length === 0 ? (
              <p className="text-sm text-ink/50">No contacts yet.</p>
            ) : (
              <ul className="space-y-3">
                {company.contacts.map((c: any) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-semibold text-ink">{c.firstName} {c.lastName}</span>
                    {c.email && <span className="block text-xs text-ink/50">{c.email}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Recent Activity</h3>
            {company.activities.length === 0 ? (
              <p className="text-sm text-ink/50">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {company.activities.slice(0, 5).map((a: any) => (
                  <li key={a.id} className="text-sm">
                    <span className="font-semibold text-ink">{a.subject}</span>
                    <span className="block text-xs text-ink/50">{a.user?.name} &middot; {new Date(a.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[3px] border border-line bg-white">
      <div className="border-b border-line px-5 py-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {href && <Link href={href} className="text-xs font-semibold text-brand hover:underline">View all</Link>}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="p-8 text-center text-sm text-ink/50">{children}</p>;
}
