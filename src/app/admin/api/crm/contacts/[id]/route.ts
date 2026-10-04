import { NextResponse } from "next/server";
import { requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

const ALLOWED = ["firstName", "lastName", "email", "phone", "companyId", "title", "role", "source", "status", "notes", "tags"];

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("contacts");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        activities: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: 100,
        },
        _count: { select: { deals: true, tickets: true } },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("contacts");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const body = await req.json();

    const before = await prisma.contact.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    for (const key of ALLOWED) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    const contact = await prisma.contact.update({
      where: { id },
      data,
      include: { company: true },
    });

    const changes: string[] = [];
    for (const key of Object.keys(data)) {
      const prev = before[key as keyof typeof before];
      const next = contact[key as keyof typeof contact];
      if (String(prev ?? "") !== String(next ?? "")) {
        changes.push(`${key}: ${display(prev)} → ${display(next)}`);
      }
    }

    if (changes.length) {
      const user = await getServerUser();
      await prisma.activity.create({
        data: {
          type: "updated",
          subject: "Contact updated",
          body: changes.join("\n"),
          userId: user?.id ?? null,
          contactId: id,
        },
      });
    }

    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("contacts");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
