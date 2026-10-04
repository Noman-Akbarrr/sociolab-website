import type { Prisma } from "@/generated/prisma/client";

/**
 * Role-based access. Four roles, nothing else:
 *  - admin (and super_admin): everything
 *  - sales_lead: all sales sections (pipelines, deals, contacts, companies, submissions)
 *  - salesman: only their own work (pipelines they are on, deals they own,
 *    contacts on those deals)
 *  - freelancer: only the projects they are assigned to, read-only
 */
export const ROLES = ["admin", "sales_lead", "salesman", "freelancer"] as const;

export type Role = (typeof ROLES)[number];

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

/** Which roles may open each section (admins always pass). */
const SECTION_ACCESS: Record<SectionKey, Role[]> = {
  pipeline: ["sales_lead", "salesman"],
  deals: ["sales_lead", "salesman"],
  contacts: ["sales_lead", "salesman"],
  companies: ["sales_lead"],
  "contact-submissions": ["sales_lead"],
  projects: ["freelancer"],
  tickets: [],
  users: [],
  settings: [],
};

export type AccessUser = {
  role: string;
};

/** The main account (and legacy admins) see everything. */
export function isFullAccess(user: AccessUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "super_admin" || user.role === "admin";
}

/** Unknown/legacy roles behave as a salesman until an admin fixes them. */
export function roleOf(user: AccessUser | null | undefined): Role {
  if (!user) return "salesman";
  if (isFullAccess(user)) return "admin";
  return (ROLES as readonly string[]).includes(user.role) ? (user.role as Role) : "salesman";
}

export function hasSection(
  user: AccessUser | null | undefined,
  section: SectionKey
): boolean {
  if (!user) return false;
  if (isFullAccess(user)) return true;
  return SECTION_ACCESS[section].includes(roleOf(user));
}

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (SECTION_KEYS as readonly string[]).includes(value);
}

/** Sales leads (and admins) build pipelines and assign people to them. */
export function isPipelineManager(user: AccessUser | null | undefined): boolean {
  if (!user) return false;
  return isFullAccess(user) || roleOf(user) === "sales_lead";
}

/** Keep a non-admin user inside the projects that were assigned to them. */
export function projectScopeFilter(userId: string): Prisma.ProjectWhereInput {
  return {
    OR: [{ members: { some: { userId } } }, { assigneeId: userId }],
  };
}

/** A salesman only sees the pipelines they were placed on. */
export function pipelineScopeFilter(userId: string): Prisma.PipelineWhereInput {
  return { members: { some: { userId } } };
}

/** A salesman only sees deals they own. */
export function dealScopeFilter(userId: string): Prisma.DealWhereInput {
  return { ownerId: userId };
}

/** A salesman only sees contacts linked to the deals they own. */
export function contactScopeFilter(userId: string): Prisma.ContactWhereInput {
  return { deals: { some: { deal: { ownerId: userId } } } };
}
