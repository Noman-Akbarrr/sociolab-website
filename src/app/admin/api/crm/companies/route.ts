import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { domain: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        _count: { select: { deals: true, projects: true, contacts: true, tickets: true } },
      },
    }),
    prisma.company.count({ where }),
  ]);

  return NextResponse.json({ companies, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
    website?: string;
    linkedin?: string;
    notes?: string;
    tags?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name) return NextResponse.json({ error: "Name required." }, { status: 400 });

  const company = await prisma.company.create({
    data: {
      name: body.name,
      domain: body.domain,
      industry: body.industry,
      size: body.size,
      website: body.website,
      linkedin: body.linkedin,
      notes: body.notes,
      tags: body.tags || [],
    },
  });

  await prisma.activity.create({
    data: {
      type: "company-created",
      subject: `Created company ${company.name}`,
      userId: user.id,
      companyId: company.id,
    },
  });

  return NextResponse.json({ company });
}