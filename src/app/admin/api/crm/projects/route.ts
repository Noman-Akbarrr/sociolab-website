import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (companyId) where.companyId = companyId;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        company: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        _count: { select: { tasks: true, invoices: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({ projects, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    name: string;
    companyId: string;
    dealId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    currency?: string;
    billingType?: string;
    description?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name || !body.companyId) {
    return NextResponse.json({ error: "Name and company required." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: body.name,
      companyId: body.companyId,
      dealId: body.dealId,
      status: body.status || "kickoff",
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      budget: body.budget,
      currency: body.currency || "USD",
      billingType: body.billingType || "fixed",
      description: body.description,
    },
    include: { company: true, deal: true },
  });

  await prisma.activity.create({
    data: {
      type: "project-created",
      subject: `Created project "${project.name}"`,
      userId: user.id,
      projectId: project.id,
      companyId: project.companyId,
    },
  });

  return NextResponse.json({ project });
}