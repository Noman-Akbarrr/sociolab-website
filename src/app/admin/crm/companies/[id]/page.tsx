import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Company | Sociolab CRM",
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
        take: 50,
      },
    },
  });
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const company = await getCompany(id);

  if (!company) notFound();

  const formatCurrency = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  const openDeals = company.deals.filter(d => !d.stage.isClosed);
  const wonDeals = company.deals.filter(d => d.stage.isWon);
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/crm/companies" className="text-sm text-ink/50 hover:underline">&larr; Back to Companies</Link>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{company.name}</h1>
        </div>
      </div>

      {/* Company Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-[3px] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          {company.domain && <span className="text-sm text-ink/50">{company.domain}</span>}
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
            {company.industry && <span>Industry: <span className="font-medium">{company.industry}</span></span>}
            {company.size && <span>Size: <span className="font-medium">{company.size}</span></span>}
            {company.website && <span><a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">Website</a></span>}
            {company.linkedin && <span><a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">LinkedIn</a></span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {company.tags.map((tag: string) => (
            <span key={tag} className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/60">{tag}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Pipeline Value</span>
          <div className="font-display text-2xl font-semibold text-brand">{formatCurrency(pipelineValue)}</div>
          <span className="text-xs text-ink/50">{openDeals.length} open deals</span>
        </div>
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Won Revenue</span>
          <div className="font-display text-2xl font-semibold text-green-600">{formatCurrency(wonValue)}</div>
          <span className="text-xs text-ink/50">{wonDeals.length} won deals</span>
        </div>
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Active Projects</span>
          <div className="font-display text-2xl font-semibold text-blue-600">{company.projects.filter(p => p.status === "active").length}</div>
          <span className="text-xs text-ink/50">{company.projects.length} total</span>
        </div>
        <div className="rounded-[3px] border border-line bg-white p-5">
          <span className="text-xs text-ink/50">Open Tickets</span>
          <div className="font-display text-2xl font-semibold text-orange-600">{company.tickets.filter(t => ["open", "waiting-client", "in-progress"].includes(t.status)).length}</div>
          <span className="text-xs text-ink/50">{company.tickets.length} total</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Contacts */}
          <div className="rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Contacts ({company.contacts.length})</h2>
              <Link href="/admin/crm/contacts/new" className="text-xs font-semibold text-brand hover:underline">+ Add</Link>
            </div>
            <div className="divide-y divide-line">
              {company.contacts.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No contacts yet.</p>
              ) : (
                company.contacts.map((contact: any) => (
                  <Link key={contact.id} href={`/admin/crm/contacts/${contact.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-display text-sm font-semibold text-ink">{contact.firstName} {contact.lastName}</span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                        {contact.title && <span>{contact.title}</span>}
                        {contact.email && <span>{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.role && <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium">{contact.role}</span>}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-ink/50">{new Date(contact.createdAt).toLocaleDateString()}</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Deals */}
          <div className="rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Deals ({company.deals.length})</h2>
              <Link href={`/admin/crm/deals?companyId=${company.id}`} className="text-xs font-semibold text-brand hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-line">
              {company.deals.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No deals yet.</p>
              ) : (
                company.deals.map((deal: any) => (
                  <Link key={deal.id} href={`/admin/crm/deals/${deal.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate font-display text-sm font-semibold text-ink">{deal.title}</span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                        <span>{formatCurrency(deal.value)}</span>
                        <span>·</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                          deal.stage.isWon ? "bg-green-100 text-green-700" : deal.stage.isClosed ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        }`} style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}>
                          {deal.stage.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Projects ({company.projects.length})</h2>
              <Link href={`/admin/crm/projects?companyId=${company.id}`} className="text-xs font-semibold text-brand hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-line">
              {company.projects.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No projects yet.</p>
              ) : (
                company.projects.map((project: any) => (
                  <Link key={project.id} href={`/admin/crm/projects/${project.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate font-display text-sm font-semibold text-ink">{project.name}</span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                        <span>{project.status}</span>
                        {project.budget && <span>{formatCurrency(project.budget)}</span>}
                        <span>{project._count.tasks} tasks</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Tickets */}
          <div className="rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Tickets ({company.tickets.length})</h2>
              <Link href={`/admin/crm/tickets?companyId=${company.id}`} className="text-xs font-semibold text-brand hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-line">
              {company.tickets.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No tickets yet.</p>
              ) : (
                company.tickets.map((ticket: any) => (
                  <Link key={ticket.id} href={`/admin/crm/tickets/${ticket.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-brand">{ticket.number}</span>
                        <span className="truncate font-display text-sm font-semibold text-ink">{ticket.subject}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${["open", "waiting-client"].includes(ticket.status) ? "bg-red-100 text-red-700" : ticket.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                          {ticket.status.replace("-", " ")}
                        </span>
                        <span>{ticket._count.messages} msgs</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-[3px] border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">Recent Activity</h2>
            </div>
            <div className="divide-y divide-line">
              {company.activities.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No activity yet.</p>
              ) : (
                company.activities.map((activity: any) => (
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
          {/* Company Info */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Details</h3>
            <dl className="space-y-4 text-sm">
              {company.industry && (
                <div>
                  <dt className="text-ink/50">Industry</dt>
                  <dd className="font-medium">{company.industry}</dd>
                </div>
              )}
              {company.size && (
                <div>
                  <dt className="text-ink/50">Size</dt>
                  <dd className="font-medium">{company.size}</dd>
                </div>
              )}
              {company.website && (
                <div>
                  <dt className="text-ink/50">Website</dt>
                  <dd className="font-medium"><a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{company.website}</a></dd>
                </div>
              )}
              {company.linkedin && (
                <div>
                  <dt className="text-ink/50">LinkedIn</dt>
                  <dd className="font-medium"><a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">LinkedIn</a></dd>
                </div>
              )}
              <div>
                <dt className="text-ink/50">Created</dt>
                <dd className="font-medium">{new Date(company.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {/* Notes */}
          {company.notes && (
            <div className="rounded-[3px] border border-line bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-ink mb-2">Notes</h3>
              <p className="text-sm text-ink/70 whitespace-pre-line">{company.notes}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link href={`/admin/crm/deals/new?companyId=${company.id}`} className="rounded-[3px] bg-brand px-3 py-2 text-sm font-medium text-white text-center hover:bg-brand-dark">+ New Deal</Link>
              <Link href={`/admin/crm/projects/new?companyId=${company.id}`} className="rounded-[3px] border border-line px-3 py-2 text-sm font-medium text-ink text-center hover:border-brand hover:bg-mist">+ New Project</Link>
              <Link href={`/admin/crm/tickets/new?companyId=${company.id}`} className="rounded-[3px] border border-line px-3 py-2 text-sm font-medium text-ink text-center hover:border-brand hover:bg-mist">+ New Ticket</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}