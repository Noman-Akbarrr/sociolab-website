import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireSection, requireProject, isMemberOfProject } from "@/lib/auth/guard";

const ALLOWED = ["title", "description", "status", "priority", "assigneeId", "dueDate", "completedAt"];

const STATUS_LABELS: Record<string, string> = {
  todo: "To do",
  "in-progress": "In progress",
  review: "In review",
  done: "Done",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; tid: string }> }
) {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    const { id, tid } = await params;
    const allowed = await requireProject(gate, id);
    if (allowed !== true) return allowed;
    const body = await req.json();

    // Only people on the project team can be given its tasks.
    if (
      typeof body.assigneeId === "string" &&
      body.assigneeId &&
      !(await isMemberOfProject(id, body.assigneeId))
    ) {
      return NextResponse.json(
        { error: "Assign this person to the project first" },
        { status: 400 }
      );
    }

    const before = await prisma.task.findFirst({ where: { id: tid, projectId: id } });
    if (!before) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    for (const key of ALLOWED) {
      if (body[key] !== undefined) {
        if (key === "dueDate") {
          data[key] = body[key] ? new Date(body[key]) : null;
        } else if (key === "assigneeId") {
          data[key] = body[key] || null;
        } else {
          data[key] = body[key];
        }
      }
    }

    if (data.status === "done" && !data.completedAt) {
      data.completedAt = new Date();
    }
    if (data.status && data.status !== "done") {
      data.completedAt = null;
    }

    const task = await prisma.task.update({
      where: { id: tid },
      data,
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    const user = await getServerUser();
    const log: Array<{ subject: string; body?: string | null; type: string }> = [];

    if (data.status && before.status !== task.status) {
      log.push({
        type: "task-status",
        subject: `Task status: ${STATUS_LABELS[before.status] ?? before.status} → ${STATUS_LABELS[task.status] ?? task.status}`,
      });
    }
    if (data.assigneeId !== undefined && before.assigneeId !== task.assigneeId) {
      const name = task.assignee?.name ?? "Unassigned";
      log.push({ type: "task-assigned", subject: `Task assigned to ${name}` });
    }
    if (data.title !== undefined && before.title !== task.title) {
      log.push({ type: "updated", subject: `Task renamed to “${task.title}”` });
    }

    for (const entry of log) {
      await prisma.activity.create({
        data: {
          type: entry.type,
          subject: entry.subject,
          body: entry.body ?? null,
          userId: user?.id ?? null,
          projectId: id,
          taskId: task.id,
        },
      });
    }

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; tid: string }> }
) {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    const { id, tid } = await params;
    const allowed = await requireProject(gate, id);
    if (allowed !== true) return allowed;
    const task = await prisma.task.findFirst({ where: { id: tid, projectId: id } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: tid } });

    const user = await getServerUser();
    await prisma.activity.create({
      data: {
        type: "task-deleted",
        subject: `Task deleted: ${task.title}`,
        userId: user?.id ?? null,
        projectId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
