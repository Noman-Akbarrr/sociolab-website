import { NextResponse } from "next/server";
import { requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

type DealRecord = {
  title: string;
  companyId: string;
  stageId: string;
  value: number;
  ownerId: string;
  priority: string;
  source: string | null;
  notes: string | null;
  probability: number;
  dealType: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  expectedClose: Date | null;
  closedAt: Date | null;
  lostReason: string | null;
};

const editableFields: { key: keyof DealRecord; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "companyId", label: "Company" },
  { key: "value", label: "Value" },
  { key: "ownerId", label: "Owner" },
  { key: "priority", label: "Priority" },
  { key: "source", label: "Source" },
  { key: "notes", label: "Notes" },
  { key: "probability", label: "Probability" },
  { key: "dealType", label: "Deal type" },
  { key: "contactName", label: "Contact name" },
  { key: "contactEmail", label: "Contact email" },
  { key: "contactPhone", label: "Contact phone" },
  { key: "expectedClose", label: "Expected close" },
  { key: "closedAt", label: "Closed at" },
  { key: "lostReason", label: "Lost reason" },
];

async function displayValue(key: keyof DealRecord, value: unknown): Promise<string> {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "value") return `Rs. ${Number(value).toLocaleString()}`;
  if (key === "probability") return `${value}%`;
  if (key === "expectedClose" || key === "closedAt") {
    return new Date(value as string).toLocaleDateString("en-GB");
  }
  if (key === "companyId") {
    const company = await prisma.company.findUnique({ where: { id: String(value) }, select: { name: true } });
    return company?.name ?? "Unknown company";
  }
  if (key === "ownerId") {
    const user = await prisma.user.findUnique({ where: { id: String(value) }, select: { name: true } });
    return user?.name ?? "Unassigned";
  }
  return String(value);
}

function sameValue(a: unknown, b: unknown): boolean {
  if (a instanceof Date || b instanceof Date) {
    const av = a ? new Date(a as string | number | Date).getTime() : null;
    const bv = b ? new Date(b as string | number | Date).getTime() : null;
    return av === bv;
  }
  return a === b || (a == null && b == null);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        stage: true,
        owner: { select: { id: true, name: true, email: true } },
        contacts: { include: { contact: true } },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const body = await req.json();

    const before = await prisma.deal.findUnique({
      where: { id },
      include: { stage: true },
    });
    if (!before) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    const allowed = [
      "title",
      "companyId",
      "pipelineId",
      "stageId",
      "value",
      "ownerId",
      "priority",
      "source",
      "contactName",
      "contactEmail",
      "contactPhone",
      "notes",
      "probability",
      "dealType",
      "expectedClose",
      "closedAt",
      "lostReason",
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        data[key] =
          key === "expectedClose" || key === "closedAt"
            ? body[key]
              ? new Date(body[key])
              : null
            : body[key];
      }
    }

    const deal = await prisma.deal.update({
      where: { id },
      data,
      include: {
        company: true,
        stage: true,
        owner: { select: { id: true, name: true, email: true } },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    const user = await getServerUser();
    const log: { type: string; subject: string; body: string | null }[] = [];

    // Stage move gets its own, human-readable entry
    if (data.stageId !== undefined && data.stageId !== before.stageId) {
      const nextStage = await prisma.pipelineStage.findUnique({
        where: { id: String(data.stageId) },
        select: { name: true, label: true },
      });
      const stageLabel = nextStage?.label ?? nextStage?.name ?? "Unknown stage";
      log.push({
        type: "stage-changed",
        subject: `Moved to ${stageLabel}`,
        body: `From ${before.stage.label || before.stage.name}`,
      });
    }

    const changes: string[] = [];
    for (const field of editableFields) {
      if (!(field.key in data)) continue;
      const next = data[field.key];
      if (sameValue(before[field.key], next)) continue;
      const [from, to] = await Promise.all([
        displayValue(field.key, before[field.key]),
        displayValue(field.key, next),
      ]);
      changes.push(`${field.label}: ${from} → ${to}`);
    }

    if (changes.length) {
      log.push({
        type: "updated",
        subject: "Deal updated",
        body: changes.join("  ·  "),
      });
    }

    if (log.length) {
      await prisma.activity.createMany({
        data: log.map((entry) => ({
          ...entry,
          dealId: id,
          userId: user?.id ?? null,
        })),
      });
    }

    return NextResponse.json(deal);
  } catch {
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
