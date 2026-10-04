import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireSection, requireAdmin, requireProject } from "@/lib/auth/guard";
import { isFullAccess } from "@/lib/access";

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

function detailInclude(full: boolean, userId: string) {
  return {
    company: true,
    assignee: { select: { id: true, name: true, email: true } },
    tasks: {
      include: { assignee: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" as const },
    },
    // Invoices and full reporting stay admin-only.
    invoices: full ? { orderBy: { dueDate: "asc" as const } } : { take: 0 },
    // A team member only ever sees the work they submitted themselves.
    submissions: full
      ? { orderBy: { submittedAt: "desc" as const } }
      : {
          where: { submitterId: userId },
          orderBy: { submittedAt: "desc" as const },
        },
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
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const allowed = await requireProject(gate, id);
    if (allowed !== true) return allowed;

    const project = await prisma.project.findUnique({
      where: { id },
      include: detailInclude(isFullAccess(gate), gate.id),
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
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const allowed = await requireProject(gate, id);
    if (allowed !== true) return allowed;
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

    // The project lead grants access to the project, so non-admins can only
    // pick someone who is already on the team.
    if (!isFullAccess(gate) && typeof data.assigneeId === "string" && data.assigneeId) {
      const alreadyTeam =
        before.assigneeId === data.assigneeId ||
        (await prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId: id, userId: data.assigneeId } },
          select: { userId: true },
        }));
      if (!alreadyTeam) {
        return NextResponse.json(
          { error: "Assign this person to the project first" },
          { status: 400 }
        );
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
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
