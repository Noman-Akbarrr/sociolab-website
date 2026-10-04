import { NextResponse } from "next/server";
import { requireRole, requireSection } from "@/lib/auth/guard";
import { dealScopeFilter, isPipelineManager, roleOf } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

export async function GET(req: Request) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { searchParams } = new URL(req.url);
    const pipelineId = searchParams.get("pipelineId");

    // Salesmen only ever see the deals they own.
    const where = {
      ...(pipelineId ? { pipelineId } : {}),
      ...(!isPipelineManager(gate) ? dealScopeFilter(gate.id) : {}),
    };

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
  const gate = await requireRole("sales_lead");
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

    // Sales leads can only hand deals to salesmen (admins pick anyone);
    // with no owner named, the deal lands on the caller's own desk.
    let finalOwnerId: string = ownerId || gate.id;
    if (!isPipelineManager(gate)) {
      const owner = await prisma.user.findUnique({
        where: { id: finalOwnerId },
        select: { id: true, role: true },
      });
      if (!owner || (roleOf(owner) !== "salesman" && owner.id !== gate.id)) {
        return NextResponse.json(
          { error: "A deal can only be assigned to a sales lead or salesman" },
          { status: 400 }
        );
      }
    } else if (!ownerId) {
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

    // The owner needs to be on the pipeline's team to see this deal.
    await prisma.pipelineMember.upsert({
      where: { pipelineId_userId: { pipelineId, userId: finalOwnerId } },
      update: {},
      create: { pipelineId, userId: finalOwnerId },
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
