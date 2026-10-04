import { NextResponse } from "next/server";
import { requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

export async function GET(req: Request) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { searchParams } = new URL(req.url);
    const pipelineId = searchParams.get("pipelineId");

    const where = pipelineId ? { pipelineId } : {};

    const deals = await prisma.deal.findMany({
      where,
      include: {
        company: true,
        stage: true,
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch {
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const body = await req.json();
    const {
      title,
      companyId,
      pipelineId,
      stageId,
      value,
      ownerId,
      priority,
      source,
      contactName,
      contactEmail,
      notes,
      expectedClose,
    } = body;

    if (!title || !companyId || !pipelineId || !stageId) {
      return NextResponse.json(
        { error: "title, companyId, pipelineId, and stageId are required" },
        { status: 400 }
      );
    }

    let finalOwnerId = ownerId;
    if (!finalOwnerId) {
      const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
      if (!firstUser) {
        return NextResponse.json({ error: "No users found to assign deal" }, { status: 400 });
      }
      finalOwnerId = firstUser.id;
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        companyId,
        pipelineId,
        stageId,
        value: value ?? 0,
        currency: "PKR",
        ownerId: finalOwnerId,
        priority: priority || "medium",
        source: source || null,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        notes: notes || null,
        expectedClose: expectedClose ? new Date(expectedClose) : null,
      },
      include: {
        company: true,
        stage: true,
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    const user = await getServerUser();
    await prisma.activity.create({
      data: {
        type: "created",
        subject: "Deal created",
        body: `Added to ${deal.stage.label || deal.stage.name}`,
        dealId: deal.id,
        userId: user?.id ?? null,
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
