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
    quote?: string;
    name?: string;
    role?: string;
    company?: string;
    photo?: string;
    approved?: boolean;
    caseStudyId?: string | null;
    projectId?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const testimonial = store.updateTestimonial(id, body);
  if (!testimonial) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ testimonial });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  store.deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
