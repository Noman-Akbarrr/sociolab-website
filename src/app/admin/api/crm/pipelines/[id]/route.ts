import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { canManagePipelines } from "@/lib/auth/roles";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const pipeline = await store.getPipeline(id);
  if (!pipeline) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const stages = await store.getStages(id);
  const { deals } = await store.getDeals({ pipelineId: id, limit: 0 });

  return NextResponse.json({ pipeline, stages, deals });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManagePipelines(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  let body: { name?: string; description?: string; color?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = await store.getPipeline(id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const pipeline = await store.updatePipeline(id, body);
  return NextResponse.json({ pipeline });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!canManagePipelines(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await store.deletePipeline(id);
  return NextResponse.json({ ok: true });
}
