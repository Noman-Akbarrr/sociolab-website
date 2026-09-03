import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const caseStudies: any[] = [];

  return NextResponse.json({ caseStudies });
}
