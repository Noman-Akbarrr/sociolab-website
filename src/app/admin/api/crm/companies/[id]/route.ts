import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

const ALLOWED = ["name", "domain", "industry", "size", "website", "linkedin", "logo", "notes", "tags"];

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: { orderBy: { createdAt: "desc" } },
        activities: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: 100,
        },
        _count: { select: { deals: true, projects: true, tickets: true } },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch {
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const before = await prisma.company.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    for (const key of ALLOWED) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    const company = await prisma.company.update({ where: { id }, data });

    const changes: string[] = [];
    for (const key of Object.keys(data)) {
      const prev = before[key as keyof typeof before];
      const next = company[key as keyof typeof company];
      if (String(prev ?? "") !== String(next ?? "")) {
        changes.push(`${key}: ${display(prev)} → ${display(next)}`);
      }
    }

    if (changes.length) {
      const user = await getServerUser();
      await prisma.activity.create({
        data: {
          type: "updated",
          subject: "Company updated",
          body: changes.join("\n"),
          userId: user?.id ?? null,
          companyId: id,
        },
      });
    }

    return NextResponse.json(company);
  } catch {
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
