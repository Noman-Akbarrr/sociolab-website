import { NextResponse } from "next/server";
import { requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("pipeline");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const stages = await prisma.pipelineStage.findMany({
      where: { pipelineId: id },
      orderBy: { order: "asc" },
      include: { _count: { select: { deals: true } } },
    });

    return NextResponse.json(
      stages.map((s) => ({
        id: s.id,
        name: s.name,
        label: s.label,
        order: s.order,
        color: s.color,
        isClosed: s.isClosed,
        isWon: s.isWon,
        dealCount: s._count.deals,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stages" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("pipeline");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const { name, color } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const maxOrder = await prisma.pipelineStage.aggregate({
      where: { pipelineId: id },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const stage = await prisma.pipelineStage.create({
      data: {
        pipelineId: id,
        name,
        label: name,
        order: nextOrder,
        color: color || "#6B7280",
      },
    });

    return NextResponse.json(stage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create stage" }, { status: 500 });
  }
}
