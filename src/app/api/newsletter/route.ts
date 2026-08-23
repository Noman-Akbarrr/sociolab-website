import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await prisma.newsletterLead.upsert({
      where: { email_source: { email, source: "newsletter" } },
      update: {},
      create: { email, source: "newsletter" },
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't save that right now. Please try again in a moment." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}