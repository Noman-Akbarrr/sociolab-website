import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const dealId = request.nextUrl.searchParams.get("dealId") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const contactId = request.nextUrl.searchParams.get("contactId") || "";
  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const ticketId = request.nextUrl.searchParams.get("ticketId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

  const result = store.getActivities({ dealId, companyId, projectId, ticketId, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    type: string;
    subject: string;
    body?: string;
    dealId?: string;
    companyId?: string;
    contactId?: string;
    projectId?: string;
    ticketId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.type || !body.subject) {
    return NextResponse.json({ error: "Type and subject required." }, { status: 400 });
  }

  const activity = store.createActivity({
    type: body.type,
    subject: body.subject,
    body: body.body,
    dealId: body.dealId,
    companyId: body.companyId,
    contactId: body.contactId,
    projectId: body.projectId,
    ticketId: body.ticketId,
  }, user.id);

  return NextResponse.json({ activity });
}
