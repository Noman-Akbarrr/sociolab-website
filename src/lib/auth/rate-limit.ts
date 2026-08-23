import type { AdminUser } from "@/lib/auth/users";
import { updateUser } from "@/lib/auth/users";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 1000 * 60 * 15;

export function isLocked(user: AdminUser): boolean {
  return Boolean(user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now());
}

export function lockRemainingMs(user: AdminUser): number {
  const lock = user.lockedUntil ? new Date(user.lockedUntil).getTime() : 0;
  return Math.max(0, lock - Date.now());
}

export async function recordFailedAttempt(user: AdminUser): Promise<{
  locked: boolean;
  remainingAttempts: number;
}> {
  const attempts = user.failedLoginAttempts + 1;
  const locked = attempts >= MAX_ATTEMPTS;
  await updateUser(user.id, {
    failedLoginAttempts: locked ? 0 : attempts,
    lockedUntil: locked ? new Date(Date.now() + LOCK_MS).toISOString() : user.lockedUntil,
  });
  return {
    locked,
    remainingAttempts: locked ? 0 : MAX_ATTEMPTS - attempts,
  };
}

export async function resetFailedAttempts(user: AdminUser): Promise<void> {
  if (user.failedLoginAttempts === 0 && !user.lockedUntil) return;
  await updateUser(user.id, { failedLoginAttempts: 0, lockedUntil: null });
}

// Per-IP throttle as a second line of defense (in-memory, resets on restart).
const ipAttempts = new Map<string, { count: number; firstAt: number }>();

export function checkIpThrottle(ip: string): boolean {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || now - entry.firstAt > 1000 * 60 * 60) {
    ipAttempts.set(ip, { count: 1, firstAt: now });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count += 1;
  return true;
}