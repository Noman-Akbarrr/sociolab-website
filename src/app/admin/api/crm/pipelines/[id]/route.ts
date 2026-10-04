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
    const pipeline = await prisma.pipeline.findUnique({
      where: { id },
      include: {
        stages: { orderBy: { order: "asc" } },
        deals: {
          include: {
            company: true,
            stage: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!pipeline) {
      return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
    }

    return NextResponse.json(pipeline);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pipeline" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("pipeline");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const { name, description, color } = await req.json();

    const pipeline = await prisma.pipeline.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
      },
    });

    return NextResponse.json(pipeline);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pipeline" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("pipeline");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    await prisma.pipeline.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pipeline" }, { status: 500 });
  }
}
