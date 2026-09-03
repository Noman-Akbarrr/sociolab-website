import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const stages = store.getStages();
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

  const stage = store.createStage({
    name: body.name,
    label: body.label,
    color: body.color,
    order: body.order,
    isClosed: body.isClosed ?? false,
    isWon: body.isWon ?? false,
  });

  return NextResponse.json({ stage });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: { id: string; label?: string; color?: string; order?: number; isClosed?: boolean; isWon?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { id, ...data } = body;
  const stage = store.updateStage(id, data);
  if (!stage) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ stage });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  store.deleteStage(id);
  return NextResponse.json({ ok: true });
}
