import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pipelines = await prisma.pipeline.findMany({
      include: {
        _count: { select: { stages: true, deals: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      pipelines.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        color: p.color,
        stageCount: p._count.stages,
        dealCount: p._count.deals,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pipelines" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, color } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const pipeline = await prisma.pipeline.create({
      data: {
        name,
        description: description || null,
        color: color || "#3b82f6",
        stages: {
          create: [
            { name: "Lead", label: "Lead", order: 0, color: "#9CA3AF" },
            { name: "Qualified", label: "Qualified", order: 1, color: "#5B8DEF" },
            { name: "Proposal", label: "Proposal", order: 2, color: "#FF9800" },
            { name: "Lost", label: "Lost", order: 3, color: "#F44336", isClosed: true },
          ],
        },
      },
      include: { stages: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(pipeline, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pipeline" }, { status: 500 });
  }
}
