import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const pipelineId = request.nextUrl.searchParams.get("pipelineId");
  if (!pipelineId) return NextResponse.json({ error: "pipelineId required." }, { status: 400 });

  const stages = store.getStages(pipelineId);
  return NextResponse.json({ stages });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: { name: string; label: string; color: string; order: number; isClosed?: boolean; isWon?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name || !body.label) return NextResponse.json({ error: "Name and label required." }, { status: 400 });

  const pipelineId = request.nextUrl.searchParams.get("pipelineId");
  if (!pipelineId) return NextResponse.json({ error: "pipelineId required." }, { status: 400 });

  const pipeline = store.getPipeline(pipelineId);
  if (!pipeline) return NextResponse.json({ error: "Pipeline not found." }, { status: 404 });

  const stage = store.createStage(pipelineId, {
    name: body.name,
    label: body.label,
    color: body.color || "#6b7280",
    order: body.order ?? 0,
    isClosed: body.isClosed ?? false,
    isWon: body.isWon ?? false,
  });

  return NextResponse.json({ stage });
}
