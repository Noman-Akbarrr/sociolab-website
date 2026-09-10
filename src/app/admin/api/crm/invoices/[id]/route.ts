import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    status?: string;
    paidAt?: string | null;
    amount?: number;
    dueDate?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const updateData: any = {};
  if (body.status) updateData.status = body.status;
  if (body.paidAt !== undefined) updateData.paidAt = body.paidAt ? new Date(body.paidAt) : null;
  if (body.amount) updateData.amount = body.amount;
  if (body.dueDate) updateData.dueDate = new Date(body.dueDate);

  const invoice = await store.updateInvoice(id, updateData);
  if (!invoice) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ invoice });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await store.deleteInvoice(id);
  return NextResponse.json({ ok: true });
}
