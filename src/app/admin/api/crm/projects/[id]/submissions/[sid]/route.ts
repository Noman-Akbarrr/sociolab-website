import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireSection, requireAdmin } from "@/lib/auth/guard";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  review: "In review",
  approved: "Approved",
  rejected: "Rejected",
};

const ACTIVITY_TYPES: Record<string, string> = {
  approved: "submission-approved",
  rejected: "submission-rejected",
  review: "submission-postponed",
  pending: "submission-updated",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;
    // Reviewing work (approve / reject / postpone) stays admin-only.
    const adminGate = await requireAdmin();
    if (adminGate instanceof NextResponse) return adminGate;
    const { id, sid } = await params;
    const body = await req.json();

    const before = await prisma.submission.findFirst({ where: { id: sid, projectId: id } });
    if (!before) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const status = typeof body.status === "string" ? body.status : before.status;
    const feedback =
      typeof body.feedback === "string" && body.feedback.trim()
        ? body.feedback.trim()
        : before.feedback;

    const submission = await prisma.submission.update({
      where: { id: sid },
      data: { status, feedback },
    });

    // Keep the linked task in sync with the review outcome.
    if (before.taskId && status !== before.status) {
      if (status === "approved") {
        await prisma.task.update({
          where: { id: before.taskId },
          data: { status: "done", completedAt: new Date() },
        });
      } else if (status === "rejected") {
        await prisma.task.update({
          where: { id: before.taskId },
          data: { status: "in-progress", completedAt: null },
        });
      } else if (status === "pending" || status === "review") {
        await prisma.task.update({
          where: { id: before.taskId },
          data: { status: "in-progress", completedAt: null },
        });
      }
    }

    const user = await getServerUser();
    const verb =
      status === "review" && before.status === "review"
        ? "Submission postponed"
        : `Submission ${STATUS_LABELS[status] ?? status}`;

    await prisma.activity.create({
      data: {
        type: ACTIVITY_TYPES[status] ?? "updated",
        subject: `${verb}: ${before.title}`,
        body: feedback || null,
        userId: user?.id ?? null,
        projectId: id,
        taskId: before.taskId,
      },
    });

    return NextResponse.json(submission);
  } catch {
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const adminGate = await requireAdmin();
    if (adminGate instanceof NextResponse) return adminGate;
    const { id, sid } = await params;
    const submission = await prisma.submission.findFirst({ where: { id: sid, projectId: id } });
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    await prisma.submission.delete({ where: { id: sid } });

    const user = await getServerUser();
    await prisma.activity.create({
      data: {
        type: "updated",
        subject: `Submission removed: ${submission.title}`,
        userId: user?.id ?? null,
        projectId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
