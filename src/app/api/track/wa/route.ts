import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cta, page, source, timestamp } = body;

    // Log the WhatsApp click for server-side attribution
    // In production, you'd persist this to your leads/events store
    console.log("[track/wa]", {
      cta,
      page,
      source: source || req.headers.get("referer") || "direct",
      timestamp: timestamp || new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never block the click
  }
}