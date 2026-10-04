import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

const ALLOWED = [
  "name",
  "companyId",
  "assigneeId",
  "status",
  "startDate",
  "endDate",
  "budget",
  "internalCost",
  "billingType",
  "description",
  "notes",
];

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

const detailInclude = {
  company: true,
  assignee: { select: { id: true, name: true, email: true } },
  tasks: {
    include: { assignee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" as const },
  },
  invoices: { orderBy: { dueDate: "asc" as const } },
  submissions: { orderBy: { submittedAt: "desc" as const } },
  activities: {
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" as const },
    take: 200,
  },
  tickets: {
    include: { assignee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" as const },
  },
  members: {
    include: { user: { select: { id: true, name: true, email: true } } },
  },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: detailInclude,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const before = await prisma.project.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    for (const key of ALLOWED) {
      if (body[key] !== undefined) {
        if (key === "startDate" || key === "endDate") {
          data[key] = body[key] ? new Date(body[key]) : null;
        } else if (key === "budget" || key === "internalCost") {
          data[key] = body[key] === null || body[key] === "" ? null : Number(body[key]);
        } else if (key === "assigneeId" || key === "companyId") {
          data[key] = body[key] || null;
        } else {
          data[key] = body[key];
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    const changes: string[] = [];
    for (const key of Object.keys(data)) {
      const prev = before[key as keyof typeof before];
      const next = project[key as keyof typeof project];
      if (String(prev ?? "") !== String(next ?? "")) {
        changes.push(`${key}: ${display(prev)} → ${display(next)}`);
      }
    }

    if (changes.length) {
      const user = await getServerUser();
      await prisma.activity.create({
        data: {
          type: "updated",
          subject: "Project updated",
          body: changes.join("\n"),
          userId: user?.id ?? null,
          projectId: id,
        },
      });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
