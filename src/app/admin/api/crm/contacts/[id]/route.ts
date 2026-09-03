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
  const contact = store.getContact(id);
  if (!contact) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const db = store.__readDb();
  const enriched = {
    ...contact,
    company: db.companies.find((c: any) => c.id === contact.companyId) || { id: contact.companyId, name: "Unknown" },
    deals: db.deals.filter((d: any) => d.contactIds?.includes(id)).map((d: any) => ({
      deal: {
        ...d,
        stage: db.pipelineStages.find((s: any) => s.id === d.stageId) || { id: d.stageId, label: "Unknown", color: "#999", isClosed: false, isWon: false },
      },
    })),
    tickets: db.tickets.filter((t: any) => t.contactId === id).map((t: any) => ({
      ...t,
      assignee: t.assigneeId ? { id: t.assigneeId, name: "Admin" } : null,
    })),
    activities: db.activities.filter((a: any) => a.contactId === id).map((a: any) => ({
      ...a,
      user: { id: a.userId, name: "Admin" },
    })).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 50),
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

  const contact = store.updateContact(id, body);
  if (!contact) return NextResponse.json({ error: "Not found." }, { status: 404 });

  store.createActivity({
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
  store.deleteContact(id);
  return NextResponse.json({ ok: true });
}
