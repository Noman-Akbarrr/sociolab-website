import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const pipelineId = request.nextUrl.searchParams.get("pipelineId") || "";
  const stageId = request.nextUrl.searchParams.get("stageId") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

  const result = store.getDeals({ pipelineId: pipelineId || undefined, stageId, companyId, search, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.title || !body.stageId || !body.pipelineId) {
    return NextResponse.json({ error: "Title, stage, and pipeline required." }, { status: 400 });
  }

  const stages = store.getStages(body.pipelineId);
  const stage = stages.find((s: any) => s.id === body.stageId);
  if (!stage) return NextResponse.json({ error: "Invalid stage." }, { status: 400 });

  // Find or create company by name
  let companyId = body.companyId || null;
  if (!companyId && body.companyName) {
    const db = store.__readDb();
    let company = db.companies.find((c: any) => c.name.toLowerCase() === body.companyName.toLowerCase());
    if (!company) {
      company = store.createCompany({ name: body.companyName, tags: ["pipeline-deal"] });
    }
    companyId = company.id;
  }

  if (!companyId) {
    // Use a placeholder company
    const db = store.__readDb();
    let placeholder = db.companies.find((c: any) => c.name === "Unknown");
    if (!placeholder) {
      placeholder = store.createCompany({ name: "Unknown", tags: ["auto-created"] });
    }
    companyId = placeholder.id;
  }

  const deal = store.createDeal({
    title: body.title,
    companyId,
    pipelineId: body.pipelineId,
    value: body.value || 0,
    currency: body.currency || "PKR",
    stageId: body.stageId,
    probability: stage.isWon ? 100 : stage.isClosed ? 0 : (body.probability || 10),
    expectedClose: body.expectedClose || null,
    contactIds: body.contactIds || [],
    // Extended fields
    contactName: body.contactName || null,
    contactEmail: body.contactEmail || null,
    contactPhone: body.contactPhone || null,
    address: body.address || null,
    city: body.city || null,
    country: body.country || null,
    source: body.source || null,
    dealType: body.dealType || null,
    priority: body.priority || "medium",
    notes: body.notes || null,
  }, user.id);

  store.createActivity({
    type: "deal-created",
    subject: `Created deal "${deal.title}"`,
    dealId: deal.id,
    companyId: deal.companyId,
  }, user.id);

  return NextResponse.json({ deal });
}
