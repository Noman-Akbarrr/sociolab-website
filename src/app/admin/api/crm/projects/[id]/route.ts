import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const project = store.getProject(id);
  if (!project) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    name?: string;
    status?: string;
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

  const project = store.updateProject(id, body);
  if (!project) return NextResponse.json({ error: "Not found." }, { status: 404 });

  store.createActivity({
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

  const { id } = await params;
  store.deleteProject(id);
  return NextResponse.json({ ok: true });
}
