import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    title?: string;
    description?: string;
    status?: string;
    priority?: number;
    assigneeId?: string | null;
    dueDate?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const updateData: any = { ...body };
  if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.status === "done" && existing.status !== "done") {
    updateData.completedAt = new Date();
  } else if (body.status && body.status !== "done") {
    updateData.completedAt = null;
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
    include: { project: true, assignee: true },
  });

  await prisma.activity.create({
    data: {
      type: "task-updated",
      subject: `Updated task "${task.title}"`,
      userId: user.id,
      taskId: task.id,
      projectId: task.projectId,
    },
  });

  return NextResponse.json({ task });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}