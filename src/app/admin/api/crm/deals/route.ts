import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const stageId = request.nextUrl.searchParams.get("stageId") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

  const result = store.getDeals({ stageId, companyId, search, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    title: string;
    companyId: string;
    value?: number;
    currency?: string;
    stageId: string;
    probability?: number;
    expectedClose?: string;
    contactIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.title || !body.companyId || !body.stageId) {
    return NextResponse.json({ error: "Title, company, and stage required." }, { status: 400 });
  }

  const stages = store.getStages();
  const stage = stages.find((s: any) => s.id === body.stageId);
  if (!stage) return NextResponse.json({ error: "Invalid stage." }, { status: 400 });

  const deal = store.createDeal({
    title: body.title,
    companyId: body.companyId,
    value: body.value || 0,
    currency: body.currency || "USD",
    stageId: body.stageId,
    probability: stage.isWon ? 100 : stage.isClosed ? 0 : (body.probability || 10),
    expectedClose: body.expectedClose || null,
    contactIds: body.contactIds || [],
  }, user.id);

  store.createActivity({
    type: "deal-created",
    subject: `Created deal "${deal.title}"`,
    dealId: deal.id,
    companyId: deal.companyId,
  }, user.id);

  return NextResponse.json({ deal });
}
