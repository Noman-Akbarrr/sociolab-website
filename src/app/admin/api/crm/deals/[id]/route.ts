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
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      company: true,
      stage: true,
      owner: { select: { id: true, name: true } },
      contacts: { include: { contact: true } },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      projects: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!deal) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ deal });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    title?: string;
    value?: number;
    currency?: string;
    stageId?: string;
    probability?: number;
    expectedClose?: string | null;
    lostReason?: string;
    contactIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = await prisma.deal.findUnique({ where: { id }, include: { stage: true } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const updateData: any = { ...body };
  if (body.expectedClose !== undefined) {
    updateData.expectedClose = body.expectedClose ? new Date(body.expectedClose) : null;
  }

  // Handle stage change
  if (body.stageId && body.stageId !== existing.stageId) {
    const newStage = await prisma.pipelineStage.findUnique({ where: { id: body.stageId } });
    if (!newStage) return NextResponse.json({ error: "Invalid stage." }, { status: 400 });

    updateData.stageId = body.stageId;
    updateData.probability = newStage.isWon ? 100 : newStage.isClosed ? 0 : (body.probability || newStage.isWon ? 100 : 10);
    if (newStage.isWon) updateData.closedAt = new Date();
    if (newStage.isClosed && !newStage.isWon) updateData.closedAt = new Date();
  }

  const deal = await prisma.deal.update({
    where: { id },
    data: updateData,
    include: { company: true, stage: true, owner: true },
  });

  // Log stage change activity
  if (body.stageId && body.stageId !== existing.stageId) {
    await prisma.activity.create({
      data: {
        type: "deal-stage-changed",
        subject: `Deal moved from "${existing.stage.label}" to "${deal.stage.label}"`,
        body: `Deal "${deal.title}" stage changed`,
        userId: user.id,
        dealId: deal.id,
        companyId: deal.companyId,
      },
    });
  }

  // Update contacts if provided
  if (body.contactIds) {
    await prisma.dealContact.deleteMany({ where: { dealId: id } });
    if (body.contactIds.length > 0) {
      await prisma.dealContact.createMany({
        data: body.contactIds.map((cid) => ({ dealId: id, contactId: cid, role: "primary" })),
      });
    }
  }

  // Auto-create project when deal won
  if (body.stageId) {
    const newStage = await prisma.pipelineStage.findUnique({ where: { id: body.stageId } });
    if (newStage?.isWon && !existing.stage.isWon) {
      const existingProject = await prisma.project.findFirst({ where: { dealId: id } });
      if (!existingProject) {
        await prisma.project.create({
          data: {
            name: deal.title,
            companyId: deal.companyId,
            dealId: deal.id,
            status: "kickoff",
            budget: deal.value || 0,
            currency: deal.currency,
            billingType: "fixed",
          },
        });
      }
    }
  }

  return NextResponse.json({ deal });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}