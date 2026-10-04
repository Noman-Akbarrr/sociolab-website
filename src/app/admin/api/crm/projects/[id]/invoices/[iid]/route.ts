import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireAdmin } from "@/lib/auth/guard";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  void: "Void",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; iid: string }> }
) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id, iid } = await params;
    const body = await req.json();

    const before = await prisma.invoice.findFirst({ where: { id: iid, projectId: id } });
    if (!before) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.amount !== undefined) data.amount = Number(body.amount) || before.amount;
    if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : before.dueDate;
    if (body.number !== undefined && body.number) data.number = body.number;
    if (body.status !== undefined && body.status) data.status = body.status;

    if (data.status === "paid") {
      data.paidAt = before.paidAt ?? new Date();
    } else if (data.status && data.status !== "paid") {
      data.paidAt = null;
    }

    const invoice = await prisma.invoice.update({ where: { id: iid }, data });

    const user = await getServerUser();
    const log: string[] = [];
    if (data.status && before.status !== invoice.status) {
      log.push(
        invoice.status === "paid"
          ? `Payment received for ${invoice.number}: Rs. ${invoice.amount.toLocaleString()}`
          : `Invoice ${invoice.number} status: ${STATUS_LABELS[before.status] ?? before.status} → ${STATUS_LABELS[invoice.status] ?? invoice.status}`
      );
    }
    if (data.dueDate && before.dueDate.toISOString() !== invoice.dueDate.toISOString()) {
      log.push(
        `Invoice ${invoice.number} due date: ${before.dueDate.toISOString().slice(0, 10)} → ${invoice.dueDate.toISOString().slice(0, 10)}`
      );
    }

    for (const subject of log) {
      await prisma.activity.create({
        data: {
          type: invoice.status === "paid" ? "payment-received" : "invoice-updated",
          subject,
          userId: user?.id ?? null,
          projectId: id,
        },
      });
    }

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; iid: string }> }
) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id, iid } = await params;
    const invoice = await prisma.invoice.findFirst({ where: { id: iid, projectId: id } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await prisma.invoice.delete({ where: { id: iid } });

    const user = await getServerUser();
    await prisma.activity.create({
      data: {
        type: "invoice-deleted",
        subject: `Invoice ${invoice.number} deleted`,
        userId: user?.id ?? null,
        projectId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
