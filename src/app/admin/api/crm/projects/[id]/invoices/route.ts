import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireAdmin } from "@/lib/auth/guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const invoices = await prisma.invoice.findMany({
      where: { projectId: id },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const body = await req.json();

    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "amount is required" }, { status: 400 });
    }
    if (!body.dueDate) {
      return NextResponse.json({ error: "dueDate is required" }, { status: 400 });
    }

    const number =
      (typeof body.number === "string" && body.number.trim()) ||
      `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const invoice = await prisma.invoice.create({
      data: {
        projectId: id,
        number,
        amount,
        currency: body.currency || "PKR",
        status: body.status || "draft",
        dueDate: new Date(body.dueDate),
      },
    });

    const user = await getServerUser();
    await prisma.activity.create({
      data: {
        type: "invoice-created",
        subject: `Invoice ${invoice.number} created: Rs. ${amount.toLocaleString()}`,
        body: `Due ${invoice.dueDate.toISOString().slice(0, 10)}`,
        userId: user?.id ?? null,
        projectId: id,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
