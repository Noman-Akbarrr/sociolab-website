import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { sid } = await params;
  let body: { label?: string; color?: string; order?: number; isClosed?: boolean; isWon?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const stage = store.updateStage(sid, body);
  if (!stage) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ stage });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { sid } = await params;
  const reassignToId = request.nextUrl.searchParams.get("reassignToId") || undefined;

  store.deleteStage(sid, reassignToId);
  return NextResponse.json({ ok: true });
}
