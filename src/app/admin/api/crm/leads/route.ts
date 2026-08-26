import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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
      companyRecord = await prisma.company.findFirst({
        where: { name: { equals: company, mode: "insensitive" } },
      });
      if (!companyRecord) {
        companyRecord = await prisma.company.create({
          data: { name: company, tags: ["inbound-lead"] },
        });
      }
    }

    // Find or create contact
    let contact = await prisma.contact.findUnique({ where: { email } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          companyId: companyRecord?.id,
          firstName,
          lastName,
          email,
          phone,
          source,
          tags: ["inbound-lead"],
          notes: message,
        },
      });
    } else if (companyRecord && !contact.companyId) {
      await prisma.contact.update({ where: { id: contact.id }, data: { companyId: companyRecord.id } });
    }

    // Get "new" stage
    const newStage = await prisma.pipelineStage.findUnique({ where: { name: "new" } });
    if (!newStage) {
      return NextResponse.json({ error: "Pipeline not configured." }, { status: 500 });
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        title: `${firstName} ${lastName} - ${company || "Inbound Lead"}`,
        companyId: companyRecord?.id || contact.id, // fallback
        value: 0,
        currency: "USD",
        stageId: newStage.id,
        probability: 10,
        ownerId: (await prisma.user.findFirst())?.id || "", // first admin
        contacts: { create: { contactId: contact.id, role: "primary" } },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: "deal-created",
        subject: `New inbound lead: ${deal.title}`,
        body: message || "Submitted via website contact form",
        userId: (await prisma.user.findFirst())?.id || "",
        dealId: deal.id,
        companyId: companyRecord?.id,
        contactId: contact.id,
      },
    });

    // TODO: Send notification email/Slack

    return NextResponse.json({ ok: true, dealId: deal.id, contactId: contact.id });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }
}