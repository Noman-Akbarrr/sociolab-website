import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const assigneeId = request.nextUrl.searchParams.get("assigneeId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  const result = await store.getTickets({ companyId, status, page, limit });

  // Enrich with relations
  const enriched = await Promise.all(result.tickets.map(async (t: any) => ({
    ...t,
    company: await store.db.company.findUnique({ where: { id: t.companyId } }).catch(() => null) || { id: t.companyId, name: "Unknown" },
    contact: t.contactId ? await store.db.contact.findUnique({ where: { id: t.contactId } }).catch(() => null) || { id: t.contactId, firstName: "Unknown", lastName: "", email: "" } : null,
    project: t.projectId ? await store.db.project.findUnique({ where: { id: t.projectId } }).catch(() => null) || { id: t.projectId, name: "Unknown" } : null,
    assignee: t.assigneeId ? { id: t.assigneeId, name: "Admin" } : null,
    _count: { messages: await store.db.ticketMessage.count({ where: { ticketId: t.id } }) },
  })));

  return NextResponse.json({ tickets: enriched, total: result.total, page: result.page, totalPages: result.totalPages });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    subject: string;
    description: string;
    companyId: string;
    contactId?: string;
    projectId?: string;
    priority?: string;
    assigneeId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.subject || !body.description || !body.companyId) {
    return NextResponse.json({ error: "Subject, description, and company required." }, { status: 400 });
  }

  const ticket = await store.createTicket({
    subject: body.subject,
    description: body.description,
    companyId: body.companyId,
    contactId: body.contactId,
    projectId: body.projectId,
    priority: body.priority || "medium",
    assigneeId: body.assigneeId,
  });

  await store.createActivity({
    type: "ticket-created",
    subject: `Created ticket ${ticket.number}: ${ticket.subject}`,
    ticketId: ticket.id,
    companyId: ticket.companyId,
  }, user.id);

  return NextResponse.json({ ticket });
}
