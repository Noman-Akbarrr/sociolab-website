import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireSection, requireProject } from "@/lib/auth/guard";
import { isFullAccess } from "@/lib/access";

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

    const submissions = await prisma.submission.findMany({
      where: isFullAccess(gate) ? { projectId: id } : { projectId: id, submitterId: gate.id },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

// Create a work submission — usually from a task the assignee just finished.
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

    const taskId = body.taskId || null;
    let task = null;
    if (taskId) {
      task = await prisma.task.findFirst({ where: { id: taskId, projectId: id } });
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
    }

    const title = (typeof body.title === "string" && body.title.trim()) || task?.title;
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const user = await getServerUser();

    const submission = await prisma.submission.create({
      data: {
        projectId: id,
        taskId,
        title,
        description: body.description?.trim() || task?.description || null,
        files: Array.isArray(body.files) ? body.files.filter((f: unknown) => typeof f === "string") : [],
        status: "review",
        submitterId: user?.id ?? null,
      },
    });

    if (task) {
      await prisma.task.update({ where: { id: task.id }, data: { status: "review" } });
    }

    await prisma.activity.create({
      data: {
        type: "submitted",
        subject: `Submitted for review: ${title}`,
        body: body.description?.trim() || null,
        userId: user?.id ?? null,
        projectId: id,
        taskId: taskId,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
