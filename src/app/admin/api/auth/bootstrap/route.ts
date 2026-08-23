import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createUser, listUsers } from "@/lib/auth/users";
import { hashPassword, validatePassword } from "@/lib/auth/password";

export const runtime = "nodejs";

// One-time bootstrap: creates the first admin when no users exist.
// Guard with ADMIN_BOOTSTRAP_TOKEN env var; remove the var after first run.

export async function POST(request: Request) {
  const configuredToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!configuredToken) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const supplied = request.headers.get("x-bootstrap-token");
  if (
    !supplied ||
    supplied.length !== configuredToken.length ||
    !timingSafeEqual(supplied, configuredToken)
  ) {
    return NextResponse.json({ error: "Invalid token." }, { status: 403 });
  }

  if ((await listUsers()).length > 0) {
    return NextResponse.json({ error: "An admin already exists." }, { status: 409 });
  }

  let name: string;
  let email: string;
  let password: string;
  try {
    const body = await request.json();
    name = typeof body.name === "string" ? body.name.trim() : "";
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  const passwordProblem = validatePassword(password);
  if (passwordProblem) {
    return NextResponse.json({ error: `Password needs ${passwordProblem}.` }, { status: 400 });
  }

  const user = await createUser({ name, email, passwordHash: await hashPassword(password) });
  return NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}