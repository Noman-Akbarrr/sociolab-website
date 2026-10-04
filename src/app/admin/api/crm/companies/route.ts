import { NextResponse } from "next/server";
import { requireUser, requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const gate = await requireUser();
  if (gate instanceof NextResponse) return gate;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { industry: { contains: search, mode: "insensitive" as const } },
            { domain: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: { select: { contacts: true, deals: true, projects: true, tickets: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireSection("companies");
  if (gate instanceof NextResponse) return gate;

  try {
    const { name, domain, industry, size, website } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        domain: domain || null,
        industry: industry || null,
        size: size || null,
        website: website || null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
