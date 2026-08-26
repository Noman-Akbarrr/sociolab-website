import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      company: true,
      deals: { include: { deal: { include: { stage: true } } }, orderBy: { deal: { createdAt: "desc" } } },
      tickets: { include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!contact) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ contact });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body: {
    companyId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    title?: string;
    role?: string;
    source?: string;
    status?: string;
    tags?: string[];
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: body,
  });

  await prisma.activity.create({
    data: {
      type: "contact-updated",
      subject: `Updated contact ${contact.firstName} ${contact.lastName}`,
      userId: user.id,
      contactId: contact.id,
      companyId: contact.companyId,
    },
  });

  return NextResponse.json({ contact });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}