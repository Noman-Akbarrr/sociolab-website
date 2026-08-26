import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      project: true,
      assignee: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
      },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

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

  const existing = await prisma.ticket.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const updateData: any = { ...body };
  if (body.status === "resolved" && existing.status !== "resolved") {
    updateData.resolvedAt = new Date();
  }
  if (body.status === "closed" && existing.status !== "closed") {
    updateData.closedAt = new Date();
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: updateData,
    include: { company: true, contact: true, project: true, assignee: true },
  });

  await prisma.activity.create({
    data: {
      type: "ticket-updated",
      subject: `Updated ticket ${ticket.number}: ${ticket.subject}`,
      userId: user.id,
      ticketId: ticket.id,
      companyId: ticket.companyId,
    },
  });

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

  const message = await prisma.ticketMessage.create({
    data: {
      ticketId: id,
      authorId: user.id,
      authorType: "user",
      body: body.body,
      internal: body.internal || false,
    },
  });

  // Update ticket status if it was open
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (ticket && ticket.status === "open") {
    await prisma.ticket.update({
      where: { id },
      data: { status: "in-progress" },
    });
  }

  await prisma.activity.create({
    data: {
      type: "ticket-message",
      subject: `Added message to ticket ${ticket?.number || id}`,
      userId: user.id,
      ticketId: id,
      companyId: ticket?.companyId,
    },
  });

  return NextResponse.json({ message });
}