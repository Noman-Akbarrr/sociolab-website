import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import type { Data } from "@puckeditor/core";
import { getCurrentUser } from "@/lib/auth/current";
import { getPageData, getPageMeta, listPages, savePage, removePage } from "@/lib/pages";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const path = request.nextUrl.searchParams.get("path");
  if (path) {
    const meta = await getPageMeta(path);
    if (!meta) return NextResponse.json({ error: "Page not found." }, { status: 404 });
    const data = await getPageData(path);
    return NextResponse.json({ meta, data });
  }

  const pages = await listPages();
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let path: string;
  let title: string;
  let description: string;
  let data: Data;
  try {
    const body = await request.json();
    path = typeof body.path === "string" ? body.path : "";
    title = typeof body.title === "string" ? body.title : "";
    description = typeof body.description === "string" ? body.description : "";
    data = body.data;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!path.startsWith("/") || path.includes("//") || path.includes(".")) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || !Array.isArray(data.content)) {
    return NextResponse.json({ error: "Invalid page data." }, { status: 400 });
  }

  const saved = await savePage(path, title, description, data);

  // Regenerate the public page + dependent listings.
  revalidatePath(path);
  revalidatePath("/resources");

  return NextResponse.json({ ok: true, page: saved });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const path = request.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path." }, { status: 400 });

  await removePage(path);
  revalidatePath(path);
  revalidatePath("/resources");

  return NextResponse.json({ ok: true });
}