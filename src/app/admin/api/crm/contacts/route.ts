import { NextResponse } from "next/server";
import { requireRole, requireSection } from "@/lib/auth/guard";
import { contactScopeFilter, isPipelineManager } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const gate = await requireSection("contacts");
  if (gate instanceof NextResponse) return gate;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const searchWhere = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : null;

    // Salesmen only reach contacts sitting on their own deals.
    const where = {
      AND: [
        ...(searchWhere ? [searchWhere] : []),
        ...(!isPipelineManager(gate) ? [contactScopeFilter(gate.id)] : []),
      ],
    };

    const contacts = await prisma.contact.findMany({
      where,
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireRole("sales_lead");
  if (gate instanceof NextResponse) return gate;

  try {
    const { firstName, lastName, email, phone, companyId, title, role, source, status } =
      await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        companyId: companyId || null,
        title: title || null,
        role: role || null,
        source: source || null,
        status: status || "active",
      },
      include: { company: true },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
