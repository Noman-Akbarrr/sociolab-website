import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const status = request.nextUrl.searchParams.get("status") || "";

  const invoices = await store.getInvoices({ projectId: projectId || undefined, status: status || undefined });
  return NextResponse.json({ invoices });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    projectId: string;
    number: string;
    amount: number;
    currency?: string;
    status?: string;
    dueDate: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.projectId || !body.number || !body.amount || !body.dueDate) {
    return NextResponse.json({ error: "Project ID, number, amount, and due date required." }, { status: 400 });
  }

  const invoice = await store.createInvoice({
    projectId: body.projectId,
    number: body.number,
    amount: body.amount,
    currency: body.currency || "USD",
    status: body.status || "draft",
    dueDate: body.dueDate,
  });

  return NextResponse.json({ invoice });
}
