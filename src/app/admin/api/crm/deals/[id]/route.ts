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
  const deal = store.getDeal(id);
  if (!deal) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ deal });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    title?: string;
    value?: number;
    currency?: string;
    stageId?: string;
    probability?: number;
    expectedClose?: string | null;
    lostReason?: string;
    contactIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const existing = store.getDeal(id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const updateData: any = { ...body };

  // Handle stage change
  if (body.stageId && body.stageId !== existing.stageId) {
    const stages = store.getStages();
    const newStage = stages.find((s: any) => s.id === body.stageId);
    if (!newStage) return NextResponse.json({ error: "Invalid stage." }, { status: 400 });

    updateData.stageId = body.stageId;
    updateData.probability = newStage.isWon ? 100 : newStage.isClosed ? 0 : (body.probability || 10);
    if (newStage.isWon) updateData.closedAt = new Date().toISOString();
    if (newStage.isClosed && !newStage.isWon) updateData.closedAt = new Date().toISOString();

    store.createActivity({
      type: "deal-stage-changed",
      subject: `Deal moved from "${existing.stage.label}" to "${newStage.label}"`,
      body: `Deal "${existing.title}" stage changed`,
      dealId: id,
      companyId: existing.companyId,
    }, user.id);
  }

  const deal = store.updateDeal(id, updateData);
  if (!deal) return NextResponse.json({ error: "Failed to update." }, { status: 500 });

  // Auto-create project when deal won
  if (body.stageId) {
    const stages = store.getStages();
    const newStage = stages.find((s: any) => s.id === body.stageId);
    const db = store.__readDb();
    const existingProject = db.projects.find((p: any) => p.dealId === id);
    if (newStage?.isWon && !existing.stage.isWon && !existingProject) {
      store.createProject({
        name: existing.title,
        companyId: existing.companyId,
        dealId: id,
        status: "kickoff",
        budget: existing.value || 0,
        currency: existing.currency,
        billingType: "fixed",
      });
    }
  }

  return NextResponse.json({ deal });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  store.deleteDeal(id);
  return NextResponse.json({ ok: true });
}
