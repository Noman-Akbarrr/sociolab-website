import type { Prisma } from "@/generated/prisma/client";

export const SECTION_KEYS = [
  "pipeline",
  "deals",
  "contacts",
  "companies",
  "contact-submissions",
  "projects",
  "tickets",
  "users",
  "settings",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  pipeline: "Pipelines",
  deals: "Deals",
  contacts: "Contacts",
  companies: "Companies",
  "contact-submissions": "Form Submissions",
  projects: "Projects",
  tickets: "Tickets",
  users: "Users",
  settings: "Settings",
};

export type AccessUser = {
  role: string;
  access?: string[] | null;
};

/** The main account (and legacy admins) see everything. */
export function isFullAccess(user: AccessUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "super_admin" || user.role === "admin";
}

export function hasSection(
  user: AccessUser | null | undefined,
  section: SectionKey
): boolean {
  if (!user) return false;
  if (isFullAccess(user)) return true;
  return (user.access ?? []).includes(section);
}

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (SECTION_KEYS as readonly string[]).includes(value);
}

/** Drop anything that is not a known section key (and dedupe). */
export function sanitizeAccess(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return SECTION_KEYS.filter((key) => input.includes(key));
}

/** Keep a non-admin user inside the projects that were assigned to them. */
export function projectScopeFilter(userId: string): Prisma.ProjectWhereInput {
  return {
    OR: [{ members: { some: { userId } } }, { assigneeId: userId }],
  };
}
