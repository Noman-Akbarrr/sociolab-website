import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  isTwoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  recoveryCodes: string[];
  failedLoginAttempts: number;
  lockedUntil: string | null;
  createdAt: string;
};

const AUTH_FILE = path.join(process.cwd(), ".puck", "auth.json");

type AuthFile = { users: AdminUser[] };

function readAuthFile(): AuthFile {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8")) as AuthFile;
    }
  } catch {
    // corrupt — start fresh
  }
  return { users: [] };
}

function writeAuthFile(db: AuthFile) {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function usesDb() {
  return Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("user:pass@host"));
}

function fromPrisma(user: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  isTwoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  recoveryCodes: unknown;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
}): AdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    twoFactorSecret: user.twoFactorSecret,
    recoveryCodes: Array.isArray(user.recoveryCodes) ? (user.recoveryCodes as string[]) : [],
    failedLoginAttempts: user.failedLoginAttempts,
    lockedUntil: user.lockedUntil ? user.lockedUntil.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listUsers(): Promise<AdminUser[]> {
  if (usesDb()) {
    const users = await prisma.user.findMany();
    return users.map(fromPrisma);
  }
  return readAuthFile().users;
}

export async function getUserByEmail(email: string): Promise<AdminUser | null> {
  const normalized = email.trim().toLowerCase();
  if (usesDb()) {
    const user = await prisma.user.findUnique({ where: { email: normalized } });
    return user ? fromPrisma(user) : null;
  }
  return readAuthFile().users.find((u) => u.email === normalized) ?? null;
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  if (usesDb()) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? fromPrisma(user) : null;
  }
  return readAuthFile().users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<AdminUser> {
  const user: AdminUser = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    role: "admin",
    isTwoFactorEnabled: false,
    twoFactorSecret: null,
    recoveryCodes: [],
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
  };
  if (usesDb()) {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
    return fromPrisma(created);
  }
  const db = readAuthFile();
  if (db.users.some((u) => u.email === user.email)) {
    throw new Error("A user with this email already exists.");
  }
  db.users.push(user);
  writeAuthFile(db);
  return user;
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<AdminUser, "id" | "email">>,
): Promise<AdminUser> {
  if (usesDb()) {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(patch.name !== undefined && { name: patch.name }),
        ...(patch.passwordHash !== undefined && { passwordHash: patch.passwordHash }),
        ...(patch.role !== undefined && { role: patch.role }),
        ...(patch.isTwoFactorEnabled !== undefined && {
          isTwoFactorEnabled: patch.isTwoFactorEnabled,
        }),
        ...(patch.twoFactorSecret !== undefined && {
          twoFactorSecret: patch.twoFactorSecret,
        }),
        ...(patch.recoveryCodes !== undefined && {
          recoveryCodes: patch.recoveryCodes,
        }),
        ...(patch.failedLoginAttempts !== undefined && {
          failedLoginAttempts: patch.failedLoginAttempts,
        }),
        ...(patch.lockedUntil !== undefined && {
          lockedUntil: patch.lockedUntil ? new Date(patch.lockedUntil) : null,
        }),
      },
    });
    return fromPrisma(updated);
  }
  const db = readAuthFile();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("User not found.");
  db.users[index] = { ...db.users[index], ...patch, id, email: db.users[index].email };
  writeAuthFile(db);
  return db.users[index];
}