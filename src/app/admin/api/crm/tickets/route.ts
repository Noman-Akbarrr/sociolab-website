import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const projectId = request.nextUrl.searchParams.get("projectId") || "";
  const assigneeId = request.nextUrl.searchParams.get("assigneeId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (companyId) where.companyId = companyId;
  if (projectId) where.projectId = projectId;
  if (assigneeId) where.assigneeId = assigneeId;

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
      include: {
        company: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return NextResponse.json({ tickets, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    subject: string;
    description: string;
    companyId: string;
    contactId?: string;
    projectId?: string;
    priority?: string;
    assigneeId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.subject || !body.description || !body.companyId) {
    return NextResponse.json({ error: "Subject, description, and company required." }, { status: 400 });
  }

  // Generate ticket number
  const count = await prisma.ticket.count();
  const number = `SOC-${String(count + 1).padStart(4, "0")}`;

  const ticket = await prisma.ticket.create({
    data: {
      number,
      subject: body.subject,
      description: body.description,
      companyId: body.companyId,
      contactId: body.contactId,
      projectId: body.projectId,
      priority: body.priority || "medium",
      assigneeId: body.assigneeId,
    },
    include: { company: true, contact: true, project: true, assignee: true },
  });

  await prisma.activity.create({
    data: {
      type: "ticket-created",
      subject: `Created ticket ${ticket.number}: ${ticket.subject}`,
      userId: user.id,
      ticketId: ticket.id,
      companyId: ticket.companyId,
    },
  });

  return NextResponse.json({ ticket });
}