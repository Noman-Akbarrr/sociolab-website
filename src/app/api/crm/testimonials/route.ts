import { NextResponse } from "next/server";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET() {
  const testimonials = store.getTestimonials();

  return NextResponse.json({ testimonials });
}
