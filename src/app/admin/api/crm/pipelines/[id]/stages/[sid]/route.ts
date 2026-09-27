import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const { id, sid } = await params;
    const { name, color } = await req.json();

    const stage = await prisma.pipelineStage.update({
      where: { id: sid, pipelineId: id },
      data: {
        ...(name !== undefined && { name, label: name }),
        ...(color !== undefined && { color }),
      },
    });

    return NextResponse.json(stage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stage" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const { id, sid } = await params;

    const stage = await prisma.pipelineStage.findUnique({
      where: { id: sid },
      include: { deals: true },
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    if (stage.deals.length > 0) {
      const firstRemaining = await prisma.pipelineStage.findFirst({
        where: { pipelineId: id, id: { not: sid } },
        orderBy: { order: "asc" },
      });

      if (firstRemaining) {
        await prisma.deal.updateMany({
          where: { stageId: sid },
          data: { stageId: firstRemaining.id },
        });
      }
    }

    await prisma.pipelineStage.delete({ where: { id: sid } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete stage" }, { status: 500 });
  }
}
