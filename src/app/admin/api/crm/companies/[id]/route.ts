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
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { createdAt: "desc" } },
      deals: {
        include: { stage: true },
        orderBy: { createdAt: "desc" },
      },
      projects: { orderBy: { createdAt: "desc" } },
      tickets: {
        include: { assignee: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: { select: { deals: true, projects: true, contacts: true, tickets: true } },
    },
  });

  if (!company) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ company });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    name?: string;
    domain?: string;
    industry?: string;
    size?: string;
    website?: string;
    linkedin?: string;
    notes?: string;
    tags?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const company = await prisma.company.update({
    where: { id },
    data: body,
  });

  await prisma.activity.create({
    data: {
      type: "company-updated",
      subject: `Updated company ${company.name}`,
      userId: user.id,
      companyId: company.id,
    },
  });

  return NextResponse.json({ company });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}