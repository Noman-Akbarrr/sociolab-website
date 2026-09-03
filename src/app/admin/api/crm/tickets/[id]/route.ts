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
  const ticket = store.getTicket(id);
  if (!ticket) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ticket });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    subject?: string;
    status?: string;
    priority?: string;
    assigneeId?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = store.__readDb().tickets.find((t: any) => t.id === id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const updateData: any = { ...body };
  if (body.status === "resolved" && existing.status !== "resolved") {
    updateData.resolvedAt = new Date().toISOString();
  }
  if (body.status === "closed" && existing.status !== "closed") {
    updateData.closedAt = new Date().toISOString();
  }

  const ticket = store.updateTicket(id, updateData);
  if (!ticket) return NextResponse.json({ error: "Failed." }, { status: 500 });

  store.createActivity({
    type: "ticket-updated",
    subject: `Updated ticket ${ticket.number}: ${ticket.subject}`,
    ticketId: ticket.id,
    companyId: ticket.companyId,
  }, user.id);

  return NextResponse.json({ ticket });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    body: string;
    internal?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.body) return NextResponse.json({ error: "Message body required." }, { status: 400 });

  const message = store.createTicketMessage({
    ticketId: id,
    authorId: user.id,
    authorType: "user",
    body: body.body,
    internal: body.internal || false,
  });

  // Update ticket status if it was open
  const ticket = store.__readDb().tickets.find((t: any) => t.id === id);
  if (ticket && ticket.status === "open") {
    store.updateTicket(id, { status: "in-progress" });
  }

  store.createActivity({
    type: "ticket-message",
    subject: `Added message to ticket ${ticket?.number || id}`,
    ticketId: id,
    companyId: ticket?.companyId,
  }, user.id);

  return NextResponse.json({ message });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const db = store.__readDb();
  db.tickets = db.tickets.filter((t: any) => t.id !== id);
  require("fs").writeFileSync(
    require("path").join(process.cwd(), ".puck", "crm.json"),
    JSON.stringify(db, null, 2),
    "utf-8"
  );
  return NextResponse.json({ ok: true });
}
