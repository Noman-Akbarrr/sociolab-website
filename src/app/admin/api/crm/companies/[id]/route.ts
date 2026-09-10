import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const company = await store.db.company.findUnique({ where: { id } });
  if (!company) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [contacts, deals, projects, tickets, activities] = await Promise.all([
    store.db.contact.findMany({ where: { companyId: id } }),
    store.db.deal.findMany({ where: { companyId: id } }),
    store.db.project.findMany({ where: { companyId: id } }),
    store.db.ticket.findMany({ where: { companyId: id } }),
    store.db.activity.findMany({ where: { companyId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const dealsWithStages = await Promise.all(deals.map(async (d: any) => ({
    ...d,
    stage: await store.db.pipelineStage.findUnique({ where: { id: d.stageId } }).catch(() => null) || { id: d.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
  })));

  const enriched = {
    ...company,
    contacts,
    deals: dealsWithStages,
    projects,
    tickets: tickets.map((t: any) => ({
      ...t,
      assignee: t.assigneeId ? { id: t.assigneeId, name: "Admin" } : null,
    })),
    activities: activities.map((a: any) => ({
      ...a,
      user: { id: a.userId, name: "Admin" },
    })),
    _count: {
      deals: deals.length,
      projects: projects.length,
      contacts: contacts.length,
      tickets: tickets.length,
    },
  };

  return NextResponse.json({ company: enriched });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    name?: string;
    domain?: string;
    industry?: string;
    size?: string;
    website?: string;
    linkedin?: string;
    logo?: string;
    notes?: string;
    tags?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const company = await store.updateCompany(id, body);
  if (!company) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await store.createActivity({
    type: "company-updated",
    subject: `Updated company ${company.name}`,
    companyId: company.id,
  }, user.id);

  return NextResponse.json({ company });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await store.deleteCompany(id);
  return NextResponse.json({ ok: true });
}
