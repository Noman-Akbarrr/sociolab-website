import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const activeOnly = request.nextUrl.searchParams.get("active") === "true";

  let services = store.getServices();
  if (activeOnly) services = services.filter((s: any) => s.active !== false);

  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    name: string;
    slug: string;
    description: string;
    shortDesc?: string;
    href?: string;
    price?: number;
    period?: string;
    featured?: boolean;
    features?: string[];
    icon?: string;
    order?: number;
    active?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name || !body.slug || !body.description) {
    return NextResponse.json({ error: "Name, slug, and description required." }, { status: 400 });
  }

  const service = store.createService({
    name: body.name,
    slug: body.slug,
    description: body.description,
    shortDesc: body.shortDesc,
    href: body.href,
    price: body.price,
    period: body.period,
    featured: body.featured || false,
    features: body.features || [],
    icon: body.icon,
    order: body.order || 0,
    active: body.active ?? true,
  });

  return NextResponse.json({ service });
}
