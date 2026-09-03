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
      const db = store.__readDb();
      companyRecord = db.companies.find((c: any) => c.name.toLowerCase() === company.toLowerCase());
      if (!companyRecord) {
        companyRecord = store.createCompany({ name: company, tags: ["inbound-lead"] });
      }
    }

    // Find or create contact
    const db = store.__readDb();
    let contact = db.contacts.find((c: any) => c.email === email);
    if (!contact) {
      contact = store.createContact({
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
    const stages = store.getStages();
    const newStage = stages.find((s: any) => s.name === "new");
    if (!newStage) {
      return NextResponse.json({ error: "Pipeline not configured." }, { status: 500 });
    }

    // Create deal
    const deal = store.createDeal({
      title: `${firstName} ${lastName} - ${company || "Inbound Lead"}`,
      companyId: companyRecord?.id || contact.id,
      value: 0,
      currency: "USD",
      stageId: newStage.id,
      probability: 10,
      ownerId: "admin",
      contactIds: [contact.id],
    }, "admin");

    store.createActivity({
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
