import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const search = request.nextUrl.searchParams.get("search") || "";
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  const result = await store.getContacts({ companyId, search, page, limit });

  // Enrich with company and counts
  const enriched = await Promise.all(result.contacts.map(async (c: any) => ({
    ...c,
    company: await store.db.company.findUnique({ where: { id: c.companyId } }).catch(() => null) || { id: c.companyId, name: "Unknown" },
    _count: {
      deals: await store.db.dealContact.count({ where: { contactId: c.id } }),
      tickets: await store.db.ticket.count({ where: { contactId: c.id } }),
    },
  })));

  return NextResponse.json({ contacts: enriched, total: result.total, page: result.page, totalPages: result.totalPages });
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

  const contact = await store.createContact({
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
  });

  await store.createActivity({
    type: "contact-created",
    subject: `Created contact ${contact.firstName} ${contact.lastName}`,
    contactId: contact.id,
    companyId: contact.companyId,
  }, user.id);

  return NextResponse.json({ contact });
}
