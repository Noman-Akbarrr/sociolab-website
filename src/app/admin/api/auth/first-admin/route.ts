import { NextRequest, NextResponse } from "next/server";
import { listUsers, createUser } from "@/lib/auth/users";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { createToken, SESSION_COOKIE, SESSION_MS } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const users = await listUsers();
  if (users.length > 0) {
    return NextResponse.json({ error: "Admin user already exists" }, { status: 400 });
  }

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: "super_admin",
  });

  const token = await createToken({
    sub: user.id,
    purpose: "session",
    exp: Date.now() + SESSION_MS,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });

  return response;
}
