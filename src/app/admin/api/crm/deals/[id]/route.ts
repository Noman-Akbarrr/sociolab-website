import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        stage: true,
        owner: { select: { id: true, name: true, email: true } },
        contacts: { include: { contact: true } },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    const allowed = [
      "title",
      "companyId",
      "pipelineId",
      "stageId",
      "value",
      "ownerId",
      "priority",
      "source",
      "contactName",
      "contactEmail",
      "notes",
      "expectedClose",
      "closedAt",
      "lostReason",
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        data[key] = key === "expectedClose" || key === "closedAt" ? (body[key] ? new Date(body[key]) : null) : body[key];
      }
    }

    const deal = await prisma.deal.update({
      where: { id },
      data,
      include: {
        company: true,
        stage: true,
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
