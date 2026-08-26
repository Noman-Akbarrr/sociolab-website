import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const search = request.nextUrl.searchParams.get("search") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
    ];
  }
  if (companyId) where.companyId = companyId;

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        company: { select: { id: true, name: true } },
        _count: { select: { deals: true, tickets: true } },
      },
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({ contacts, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    companyId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    role?: string;
    source?: string;
    tags?: string[];
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.firstName || !body.lastName || !body.email) {
    return NextResponse.json({ error: "First name, last name, and email required." }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      companyId: body.companyId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      title: body.title,
      role: body.role,
      source: body.source,
      tags: body.tags || [],
      notes: body.notes,
    },
  });

  await prisma.activity.create({
    data: {
      type: "contact-created",
      subject: `Created contact ${contact.firstName} ${contact.lastName}`,
      userId: user.id,
      contactId: contact.id,
      companyId: contact.companyId,
    },
  });

  return NextResponse.json({ contact });
}