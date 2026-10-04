import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

const PARENT_KEYS = ["contactId", "companyId", "projectId", "ticketId", "taskId", "dealId"] as const;

function parentWhere(searchParams: URLSearchParams) {
  const where: Record<string, string> = {};
  for (const key of PARENT_KEYS) {
    const value = searchParams.get(key);
    if (value) where[key] = value;
  }
  return where;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const where = parentWhere(searchParams);

    if (Object.keys(where).length === 0) {
      return NextResponse.json({ error: "A parent id is required" }, { status: 400 });
    }

    const activities = await prisma.activity.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type || "note";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";

    if (!subject) {
      return NextResponse.json({ error: "subject is required" }, { status: 400 });
    }

    const parents: Record<string, string | null | undefined> = {};
    for (const key of PARENT_KEYS) {
      parents[key] = body[key] ?? null;
    }

    if (!Object.values(parents).some(Boolean)) {
      return NextResponse.json({ error: "A parent id is required" }, { status: 400 });
    }

    const user = await getServerUser();

    const activity = await prisma.activity.create({
      data: {
        type,
        subject,
        body: typeof body.body === "string" && body.body.trim() ? body.body.trim() : null,
        userId: user?.id ?? null,
        contactId: parents.contactId ?? null,
        companyId: parents.companyId ?? null,
        projectId: parents.projectId ?? null,
        ticketId: parents.ticketId ?? null,
        taskId: parents.taskId ?? null,
        dealId: parents.dealId ?? null,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
