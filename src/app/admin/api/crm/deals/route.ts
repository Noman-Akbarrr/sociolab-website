import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const stageId = request.nextUrl.searchParams.get("stageId") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (stageId) where.stageId = stageId;
  if (companyId) where.companyId = companyId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [deals, total, stages] = await Promise.all([
    prisma.deal.findMany({
      where,
      orderBy: [{ stage: { order: "asc" } }, { createdAt: "desc" }],
      skip,
      take: limit,
      include: {
        company: { select: { id: true, name: true } },
        stage: true,
        owner: { select: { id: true, name: true } },
        contacts: { include: { contact: { select: { id: true, firstName: true, lastName: true, email: true } } } },
        _count: { select: { activities: true } },
      },
    }),
    prisma.deal.count({ where }),
    prisma.pipelineStage.findMany({ orderBy: { order: "asc" } }),
  ]);

  // Group by stage for Kanban
  const dealsByStage = stages.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stageId === stage.id),
  }));

  return NextResponse.json({ deals, dealsByStage, stages, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    title: string;
    companyId: string;
    value?: number;
    currency?: string;
    stageId: string;
    probability?: number;
    expectedClose?: string;
    contactIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.title || !body.companyId || !body.stageId) {
    return NextResponse.json({ error: "Title, company, and stage required." }, { status: 400 });
  }

  const stage = await prisma.pipelineStage.findUnique({ where: { id: body.stageId } });
  if (!stage) return NextResponse.json({ error: "Invalid stage." }, { status: 400 });

  const deal = await prisma.deal.create({
    data: {
      title: body.title,
      companyId: body.companyId,
      value: body.value || 0,
      currency: body.currency || "USD",
      stageId: body.stageId,
      probability: stage.isWon ? 100 : stage.isClosed ? 0 : (body.probability || 10),
      expectedClose: body.expectedClose ? new Date(body.expectedClose) : null,
      ownerId: user.id,
      contacts: body.contactIds
        ? { create: body.contactIds.map((cid) => ({ contactId: cid, role: "primary" })) }
        : undefined,
    },
    include: { company: true, stage: true, owner: true },
  });

  await prisma.activity.create({
    data: {
      type: "deal-created",
      subject: `Created deal "${deal.title}"`,
      userId: user.id,
      dealId: deal.id,
      companyId: deal.companyId,
    },
  });

  return NextResponse.json({ deal });
}