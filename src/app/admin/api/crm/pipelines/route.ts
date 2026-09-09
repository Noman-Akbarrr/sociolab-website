import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const pipelinesRaw = await store.getPipelines();
  const pipelines = await Promise.all(pipelinesRaw.map(async (pipeline: any) => {
    const stages = await store.getStages(pipeline.id);
    const { deals, total } = await store.getDeals({ pipelineId: pipeline.id, limit: 0 });
    return { ...pipeline, stages, dealCount: total, totalValue: deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0) };
  }));

  return NextResponse.json({ pipelines });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: { name: string; description?: string; color?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name) return NextResponse.json({ error: "Name required." }, { status: 400 });

  const pipeline = await store.createPipeline({
    name: body.name,
    description: body.description || "",
    color: body.color || "#3b82f6",
  });

  return NextResponse.json({ pipeline });
}
