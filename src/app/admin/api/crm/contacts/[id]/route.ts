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
  const contact = await store.getContact(id);
  if (!contact) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [company, dealContacts, tickets, activities] = await Promise.all([
    contact.companyId ? store.db.company.findUnique({ where: { id: contact.companyId } }).catch(() => null) : null,
    store.db.dealContact.findMany({ where: { contactId: id }, include: { deal: true } }),
    store.db.ticket.findMany({ where: { contactId: id } }),
    store.db.activity.findMany({ where: { contactId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const deals = await Promise.all(dealContacts.map(async (dc: any) => ({
    deal: {
      ...dc.deal,
      stage: await store.db.pipelineStage.findUnique({ where: { id: dc.deal.stageId } }).catch(() => null) || { id: dc.deal.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
    },
  })));

  const enriched = {
    ...contact,
    company: company || { id: contact.companyId, name: "Unknown" },
    deals,
    tickets: tickets.map((t: any) => ({
      ...t,
      assignee: t.assigneeId ? { id: t.assigneeId, name: "Admin" } : null,
    })),
    activities: activities.map((a: any) => ({
      ...a,
      user: { id: a.userId, name: "Admin" },
    })),
  };

  return NextResponse.json({ contact: enriched });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    companyId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    title?: string;
    role?: string;
    source?: string;
    status?: string;
    tags?: string[];
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const contact = await store.updateContact(id, body);
  if (!contact) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await store.createActivity({
    type: "contact-updated",
    subject: `Updated contact ${contact.firstName} ${contact.lastName}`,
    contactId: contact.id,
    companyId: contact.companyId,
  }, user.id);

  return NextResponse.json({ contact });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await store.deleteContact(id);
  return NextResponse.json({ ok: true });
}
