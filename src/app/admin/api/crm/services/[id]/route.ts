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
    name?: string;
    slug?: string;
    description?: string;
    shortDesc?: string;
    href?: string;
    price?: number;
    period?: string;
    featured?: boolean;
    features?: string[];
    icon?: string;
    order?: number;
    active?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const service = store.updateService(id, body);
  if (!service) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ service });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  store.deleteService(id);
  return NextResponse.json({ ok: true });
}
