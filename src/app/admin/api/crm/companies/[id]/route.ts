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
  const db = store.__readDb();
  const company = db.companies.find((c: any) => c.id === id);
  if (!company) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const enriched = {
    ...company,
    contacts: db.contacts.filter((c: any) => c.companyId === id),
    deals: db.deals.filter((d: any) => d.companyId === id).map((d: any) => ({
      ...d,
      stage: db.pipelineStages.find((s: any) => s.id === d.stageId) || { id: d.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
    })),
    projects: db.projects.filter((p: any) => p.companyId === id),
    tickets: db.tickets.filter((t: any) => t.companyId === id).map((t: any) => ({
      ...t,
      assignee: t.assigneeId ? { id: t.assigneeId, name: "Admin" } : null,
    })),
    activities: db.activities.filter((a: any) => a.companyId === id).map((a: any) => ({
      ...a,
      user: { id: a.userId, name: "Admin" },
    })).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 50),
    _count: {
      deals: db.deals.filter((d: any) => d.companyId === id).length,
      projects: db.projects.filter((p: any) => p.companyId === id).length,
      contacts: db.contacts.filter((c: any) => c.companyId === id).length,
      tickets: db.tickets.filter((t: any) => t.companyId === id).length,
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
    notes?: string;
    tags?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const company = store.updateCompany(id, body);
  if (!company) return NextResponse.json({ error: "Not found." }, { status: 404 });

  store.createActivity({
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
  store.deleteCompany(id);
  return NextResponse.json({ ok: true });
}
