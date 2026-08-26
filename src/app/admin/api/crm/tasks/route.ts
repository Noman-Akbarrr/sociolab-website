import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const assigneeId = request.nextUrl.searchParams.get("assigneeId") || "";
  const status = request.nextUrl.searchParams.get("status") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (assigneeId) where.assigneeId = assigneeId;
  if (status) where.status = status;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
      skip,
      take: limit,
      include: {
        project: { select: { id: true, name: true, companyId: true } },
        assignee: { select: { id: true, name: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return NextResponse.json({ tasks, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    projectId: string;
    title: string;
    description?: string;
    status?: string;
    priority?: number;
    assigneeId?: string;
    dueDate?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.projectId || !body.title) {
    return NextResponse.json({ error: "Project ID and title required." }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      status: body.status || "todo",
      priority: body.priority || 0,
      assigneeId: body.assigneeId,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
    include: { project: true, assignee: true },
  });

  await prisma.activity.create({
    data: {
      type: "task-created",
      subject: `Created task "${task.title}"`,
      userId: user.id,
      taskId: task.id,
      projectId: task.projectId,
    },
  });

  return NextResponse.json({ task });
}