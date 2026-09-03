import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const assigneeId = request.nextUrl.searchParams.get("assigneeId") || "";
  const status = request.nextUrl.searchParams.get("status") || "";

  const tasks = store.getTasks({ projectId, assigneeId, status });
  return NextResponse.json({ tasks, total: tasks.length });
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

  const task = store.createTask({
    projectId: body.projectId,
    title: body.title,
    description: body.description,
    status: body.status || "todo",
    priority: body.priority || 0,
    assigneeId: body.assigneeId,
    dueDate: body.dueDate || null,
  });

  store.createActivity({
    type: "task-created",
    subject: `Created task "${task.title}"`,
    taskId: task.id,
    projectId: task.projectId,
  }, user.id);

  return NextResponse.json({ task });
}
