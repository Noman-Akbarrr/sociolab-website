import { NextResponse } from "next/server";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET() {
  const services = store.getServices();

  return NextResponse.json({ services });
}
