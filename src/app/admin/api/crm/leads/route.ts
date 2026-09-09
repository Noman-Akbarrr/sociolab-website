import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, company, message, source = "website-contact" } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email required." }, { status: 400 });
    }

    // Find or create company
    let companyRecord = null;
    if (company) {
      companyRecord = await store.db.company.findFirst({ where: { name: { equals: company, mode: "insensitive" } } });
      if (!companyRecord) {
        companyRecord = await store.createCompany({ name: company, tags: ["inbound-lead"] });
      }
    }

    // Find or create contact
    let contact = await store.db.contact.findFirst({ where: { email } });
    if (!contact) {
      contact = await store.createContact({
        companyId: companyRecord?.id,
        firstName,
        lastName,
        email,
        phone,
        source,
        tags: ["inbound-lead"],
        notes: message,
      });
    }

    // Get "new" stage
    const stages = await store.getStages();
    const newStage = stages.find((s: any) => s.name === "new");
    if (!newStage) {
      return NextResponse.json({ error: "Pipeline not configured." }, { status: 500 });
    }

    // Create deal
    const deal = await store.createDeal({
      title: `${firstName} ${lastName} - ${company || "Inbound Lead"}`,
      companyId: companyRecord?.id || contact.id,
      value: 0,
      currency: "USD",
      stageId: newStage.id,
      probability: 10,
      ownerId: "admin",
      contactIds: [contact.id],
    }, "admin");

    await store.createActivity({
      type: "deal-created",
      subject: `New inbound lead: ${deal.title}`,
      body: message || "Submitted via website contact form",
      dealId: deal.id,
      companyId: companyRecord?.id,
      contactId: contact.id,
    }, "admin");

    return NextResponse.json({ ok: true, dealId: deal.id, contactId: contact.id });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }
}
