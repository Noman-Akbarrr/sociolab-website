import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
