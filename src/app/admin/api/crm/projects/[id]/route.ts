import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { canManageProjects, canDeleteProject } from "@/lib/auth/roles";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const project = await store.getProject(id);
  if (!project) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManageProjects(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  let body: {
    name?: string;
    status?: string;
    assigneeId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    budget?: number;
    currency?: string;
    billingType?: string;
    description?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const project = await store.updateProject(id, body);
  if (!project) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await store.createActivity({
    type: "project-updated",
    subject: `Updated project "${project.name}"`,
    projectId: project.id,
    companyId: project.companyId,
  }, user.id);

  return NextResponse.json({ project });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canDeleteProject(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await store.deleteProject(id);
  return NextResponse.json({ ok: true });
}
