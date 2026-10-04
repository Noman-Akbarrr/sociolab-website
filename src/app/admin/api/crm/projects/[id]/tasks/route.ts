import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireSection, requireProject, isMemberOfProject } from "@/lib/auth/guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const allowed = await requireProject(gate, id);
    if (allowed !== true) return allowed;

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      include: { assignee: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const allowed = await requireProject(gate, id);
    if (allowed !== true) return allowed;

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    // Only people on the project team can be given its tasks.
    if (body.assigneeId && !(await isMemberOfProject(id, body.assigneeId))) {
      return NextResponse.json(
        { error: "Assign this person to the project first" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        projectId: id,
        title,
        description: body.description?.trim() || null,
        assigneeId: body.assigneeId || null,
        priority: Number(body.priority) || 0,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: "todo",
      },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    const user = await getServerUser();
    const assignee = body.assigneeId ? " (assigned)" : "";
    await prisma.activity.create({
      data: {
        type: "task-created",
        subject: `Task created: ${title}${assignee}`,
        body: body.description?.trim() || null,
        userId: user?.id ?? null,
        projectId: id,
        taskId: task.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
