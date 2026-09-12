import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  const result = await store.getProjects({ companyId, status, page, limit });

  // Enrich with relations
  const enriched = await Promise.all(result.projects.map(async (p: any) => {
    const deal = p.dealId ? await store.db.deal.findUnique({ where: { id: p.dealId } }).catch(() => null) : null;
    return {
      ...p,
      company: await store.db.company.findUnique({ where: { id: p.companyId } }).catch(() => null) || { id: p.companyId, name: "Unknown" },
      deal: deal ? { id: deal.id, title: deal.title } : null,
      _count: {
        tasks: await store.db.task.count({ where: { projectId: p.id } }),
        invoices: 0,
      },
    };
  }));

  return NextResponse.json({ projects: enriched, total: result.total, page: result.page, totalPages: result.totalPages });
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
    memberIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name || !body.companyId) {
    return NextResponse.json({ error: "Name and company required." }, { status: 400 });
  }

  const project = await store.createProject({
    name: body.name,
    companyId: body.companyId,
    dealId: body.dealId,
    status: body.status || "kickoff",
    startDate: body.startDate || null,
    endDate: body.endDate || null,
    budget: body.budget,
    currency: body.currency || "USD",
    billingType: body.billingType || "fixed",
    description: body.description,
  });

  // Add project members
  if (body.memberIds && body.memberIds.length > 0) {
    const { prisma } = await import("@/lib/prisma");
    for (const memberId of body.memberIds) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: project.id, userId: memberId } },
        update: {},
        create: { projectId: project.id, userId: memberId, role: "member" },
      });
    }
  }

  await store.createActivity({
    type: "project-created",
    subject: `Created project "${project.name}"`,
    projectId: project.id,
    companyId: project.companyId,
  }, user.id);

  return NextResponse.json({ project });
}
