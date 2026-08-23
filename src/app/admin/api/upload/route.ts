import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getCurrentUser } from "@/lib/auth/current";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

function getUploadRoot(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
}

async function storeVercelBlob(file: File, relative: string, name: string): Promise<string> {
  const { put } = await import("@vercel/blob");
  const blob = await put(`${relative}/${name}`, file, {
    access: "public",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let file: File | null = null;
  try {
    const form = await request.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only images are allowed (JPEG, PNG, WebP, GIF, SVG, AVIF)." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
  }

  const ext = EXT[file.type];
  const now = new Date();
  const relative = path.join(
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
  );

  // Use Vercel Blob if token is available (production on Vercel)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const name = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const url = await storeVercelBlob(file, relative, name);
    return NextResponse.json({ ok: true, url });
  }

  // Local filesystem fallback (dev)
  const uploadRoot = getUploadRoot();
  const dir = path.join(uploadRoot, relative);
  fs.mkdirSync(dir, { recursive: true });

  const name = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, name), bytes);

  const url = `/uploads/${relative.split(path.sep).join("/")}/${name}`;
  return NextResponse.json({ ok: true, url });
}