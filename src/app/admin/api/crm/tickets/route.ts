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

  const result = store.getTickets({ companyId, status, page, limit });

  // Enrich with relations
  const db = store.__readDb();
  const enriched = result.tickets.map((t: any) => ({
    ...t,
    company: db.companies.find((c: any) => c.id === t.companyId) || { id: t.companyId, name: "Unknown" },
    contact: t.contactId ? db.contacts.find((c: any) => c.id === t.contactId) || { id: t.contactId, firstName: "Unknown", lastName: "", email: "" } : null,
    project: t.projectId ? db.projects.find((p: any) => p.id === t.projectId) || { id: t.projectId, name: "Unknown" } : null,
    assignee: t.assigneeId ? { id: t.assigneeId, name: "Admin" } : null,
    _count: { messages: db.ticketMessages.filter((m: any) => m.ticketId === t.id).length },
  }));

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

  const ticket = store.createTicket({
    subject: body.subject,
    description: body.description,
    companyId: body.companyId,
    contactId: body.contactId,
    projectId: body.projectId,
    priority: body.priority || "medium",
    assigneeId: body.assigneeId,
  });

  store.createActivity({
    type: "ticket-created",
    subject: `Created ticket ${ticket.number}: ${ticket.subject}`,
    ticketId: ticket.id,
    companyId: ticket.companyId,
  }, user.id);

  return NextResponse.json({ ticket });
}
