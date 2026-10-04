import { NextResponse } from "next/server";
import { canTouchDeal, requireSection } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";

const activityTypes = ["note", "call", "email", "meeting", "task", "stage-changed", "updated", "created"];

async function ownedDeal(gate: Awaited<ReturnType<typeof requireSection>>, id: string) {
  if (gate instanceof NextResponse) return gate;
  const deal = await prisma.deal.findUnique({
    where: { id },
    select: { id: true, ownerId: true },
  });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  if (!canTouchDeal(gate, deal)) {
    return NextResponse.json({ error: "This deal is not yours" }, { status: 403 });
  }
  return deal;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const deal = await ownedDeal(gate, id);
    if (deal instanceof NextResponse) return deal;

    const activities = await prisma.activity.findMany({
      where: { dealId: id },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSection("deals");
  if (gate instanceof NextResponse) return gate;

  try {
    const { id } = await params;
    const { type = "note", subject, body } = await req.json();

    if (!subject || !String(subject).trim()) {
      return NextResponse.json({ error: "subject is required" }, { status: 400 });
    }
    if (!activityTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid activity type" }, { status: 400 });
    }

    const deal = await ownedDeal(gate, id);
    if (deal instanceof NextResponse) return deal;

    const user = await getServerUser();
    const activity = await prisma.activity.create({
      data: {
        type,
        subject: String(subject).trim(),
        body: body && String(body).trim() ? String(body).trim() : null,
        dealId: id,
        userId: user?.id ?? null,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
