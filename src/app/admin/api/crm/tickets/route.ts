import { NextResponse } from "next/server";
import { requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const gate = await requireSection("tickets");
  if (gate instanceof NextResponse) return gate;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireSection("tickets");
  if (gate instanceof NextResponse) return gate;

  try {
    const { subject, description, companyId, priority, assigneeId } = await req.json();

    if (!subject || !description || !companyId) {
      return NextResponse.json(
        { error: "subject, description, and companyId are required" },
        { status: 400 }
      );
    }

    const maxTicket = await prisma.ticket.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });

    let nextNumber = 1001;
    if (maxTicket) {
      const parsed = parseInt(maxTicket.number.replace("SOC-", ""), 10);
      if (!isNaN(parsed)) {
        nextNumber = parsed + 1;
      }
    }

    const ticket = await prisma.ticket.create({
      data: {
        number: `SOC-${nextNumber}`,
        subject,
        description,
        companyId,
        priority: priority || "medium",
        assigneeId: assigneeId || null,
      },
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
