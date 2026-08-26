import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEFAULT_STAGES = [
  { name: "new", label: "New Lead", order: 0, color: "#6b7280", isClosed: false, isWon: false },
  { name: "qualified", label: "Qualified", order: 1, color: "#3b82f6", isClosed: false, isWon: false },
  { name: "proposal", label: "Proposal Sent", order: 2, color: "#8b5cf6", isClosed: false, isWon: false },
  { name: "negotiation", label: "Negotiation", order: 3, color: "#f59e0b", isClosed: false, isWon: false },
  { name: "won", label: "Won", order: 4, color: "#22c55e", isClosed: true, isWon: true },
  { name: "lost", label: "Lost", order: 5, color: "#ef4444", isClosed: true, isWon: false },
];

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const stages = await prisma.pipelineStage.findMany({
    orderBy: { order: "asc" },
  });

  if (stages.length === 0) {
    // Create default stages
    for (const stage of DEFAULT_STAGES) {
      await prisma.pipelineStage.create({ data: stage });
    }
    const created = await prisma.pipelineStage.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ stages: created });
  }

  return NextResponse.json({ stages });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: { name: string; label: string; color: string; order: number; isClosed?: boolean; isWon?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const stage = await prisma.pipelineStage.create({
    data: {
      name: body.name,
      label: body.label,
      color: body.color,
      order: body.order,
      isClosed: body.isClosed ?? false,
      isWon: body.isWon ?? false,
    },
  });

  return NextResponse.json({ stage });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: { id: string; label?: string; color?: string; order?: number; isClosed?: boolean; isWon?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { id, ...data } = body;
  const stage = await prisma.pipelineStage.update({
    where: { id },
    data,
  });

  return NextResponse.json({ stage });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  await prisma.pipelineStage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}