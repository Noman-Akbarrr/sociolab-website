import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { canManagePipelines } from "@/lib/auth/roles";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const pipelineId = request.nextUrl.searchParams.get("pipelineId") || "";
  if (!pipelineId) return NextResponse.json({ error: "pipelineId required" }, { status: 400 });

  const members = await prisma.pipelineMember.findMany({
    where: { pipelineId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManagePipelines(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { pipelineId, userId } = body;

  if (!pipelineId || !userId) {
    return NextResponse.json({ error: "pipelineId and userId required" }, { status: 400 });
  }

  const member = await prisma.pipelineMember.upsert({
    where: { pipelineId_userId: { pipelineId, userId } },
    update: {},
    create: { pipelineId, userId },
  });

  return NextResponse.json(member);
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManagePipelines(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { pipelineId, userId } = body;

  if (!pipelineId || !userId) {
    return NextResponse.json({ error: "pipelineId and userId required" }, { status: 400 });
  }

  await prisma.pipelineMember.deleteMany({
    where: { pipelineId, userId },
  });

  return NextResponse.json({ ok: true });
}
