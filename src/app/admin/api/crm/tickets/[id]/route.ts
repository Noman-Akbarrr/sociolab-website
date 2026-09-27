import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    const allowed = ["status", "priority", "assigneeId", "subject", "description"];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    if (body.status === "resolved" && !body.resolvedAt) {
      data.resolvedAt = new Date();
    }
    if (body.status === "closed" && !body.closedAt) {
      data.closedAt = new Date();
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data,
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.ticket.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
