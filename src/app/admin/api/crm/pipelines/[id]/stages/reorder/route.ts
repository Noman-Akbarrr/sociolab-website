import { NextResponse } from "next/server";
import { requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("pipeline");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const { stageIds } = await req.json();

    if (!Array.isArray(stageIds) || stageIds.length === 0) {
      return NextResponse.json({ error: "stageIds array is required" }, { status: 400 });
    }

    await prisma.$transaction(
      stageIds.map((stageId: string, index: number) =>
        prisma.pipelineStage.update({
          where: { id: stageId, pipelineId: id },
          data: { order: index },
        })
      )
    );

    const stages = await prisma.pipelineStage.findMany({
      where: { pipelineId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(stages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder stages" }, { status: 500 });
  }
}
