import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

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

  const updateData: any = { ...body };
  if (body.status === "done") {
    updateData.completedAt = new Date().toISOString();
  } else if (body.status && body.status !== "done") {
    updateData.completedAt = null;
  }

  const task = store.updateTask(id, updateData);
  if (!task) return NextResponse.json({ error: "Not found." }, { status: 404 });

  store.createActivity({
    type: "task-updated",
    subject: `Updated task "${task.title}"`,
    taskId: task.id,
    projectId: task.projectId,
  }, user.id);

  return NextResponse.json({ task });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  store.deleteTask(id);
  return NextResponse.json({ ok: true });
}
