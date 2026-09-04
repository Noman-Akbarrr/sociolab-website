import { NextResponse } from "next/server";
import { createUser, listUsers } from "@/lib/auth/users";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { createToken, SESSION_COOKIE, SESSION_MS } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  const token = await createToken({
    sub: user.id,
    purpose: "session",
    exp: Date.now() + SESSION_MS,
  });

  const response = NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email },
  });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });

  return response;
}
