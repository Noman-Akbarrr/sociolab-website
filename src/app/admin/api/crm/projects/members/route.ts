import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { canManageProjects } from "@/lib/auth/roles";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManageProjects(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { projectId, userId, role } = body;

  if (!projectId || !userId) {
    return NextResponse.json({ error: "projectId and userId required" }, { status: 400 });
  }

  const member = await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId, userId } },
    update: { role: role || "member" },
    create: { projectId, userId, role: role || "member" },
  });

  return NextResponse.json(member);
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManageProjects(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { projectId, userId } = body;

  if (!projectId || !userId) {
    return NextResponse.json({ error: "projectId and userId required" }, { status: 400 });
  }

  await prisma.projectMember.deleteMany({
    where: { projectId, userId },
  });

  return NextResponse.json({ ok: true });
}
