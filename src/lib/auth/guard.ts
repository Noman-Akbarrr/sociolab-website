import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import {
  hasSection,
  isFullAccess,
  isPipelineManager,
  projectScopeFilter,
  roleOf,
  type SectionKey,
} from "@/lib/access";
import type { AdminUser } from "@/lib/auth/users";

function denied(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser(): Promise<AdminUser | NextResponse> {
  const user = await getServerUser();
  if (!user) return denied("Unauthorized", 401);
  return user;
}

/** Logged in + allowed to see this dashboard section. */
export async function requireSection(section: SectionKey): Promise<AdminUser | NextResponse> {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  if (!hasSection(user, section)) return denied("You do not have access to this section", 403);
  return user;
}

/** Logged in + one of these roles (admins always pass). */
export async function requireRole(
  ...roles: string[]
): Promise<AdminUser | NextResponse> {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  if (!isFullAccess(user) && !roles.includes(roleOf(user))) {
    return denied("You do not have access to this", 403);
  }
  return user;
}

/** Logged in + full (admin) access. */
export async function requireAdmin(): Promise<AdminUser | NextResponse> {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  if (!isFullAccess(user)) return denied("Admin access required", 403);
  return user;
}

/** Can this user build pipelines and assign people to them? */
export async function requirePipelineManager(): Promise<AdminUser | NextResponse> {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  if (!isPipelineManager(user)) return denied("Only a sales lead can manage pipelines", 403);
  return user;
}

/** May this user open this pipeline's board? */
export async function canAccessPipeline(user: AdminUser, pipelineId: string): Promise<boolean> {
  if (isPipelineManager(user)) return true;
  const member = await prisma.pipelineMember.findUnique({
    where: { pipelineId_userId: { pipelineId, userId: user.id } },
    select: { id: true },
  });
  return Boolean(member);
}

export async function requirePipeline(
  user: AdminUser,
  pipelineId: string
): Promise<true | NextResponse> {
  if (await canAccessPipeline(user, pipelineId)) return true;
  return denied("This pipeline is not assigned to you", 403);
}

/** Salesmen may only touch deals they own; leads and admins touch any. */
export function canTouchDeal(
  user: AdminUser,
  deal: { ownerId: string }
): boolean {
  if (isPipelineManager(user)) return true;
  return deal.ownerId === user.id;
}

/** Is this user on the project team (member or project assignee)? */
export async function isMemberOfProject(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      assigneeId: true,
      members: { select: { userId: true } },
    },
  });
  if (!project) return false;
  return project.assigneeId === userId || project.members.some((m) => m.userId === userId);
}

/**
 * Only admins work on projects outside their team; everyone else must be
 * on the project team (as a member or as the project assignee).
 */
export async function canAccessProject(user: AdminUser, projectId: string): Promise<boolean> {
  if (isFullAccess(user)) return true;
  return isMemberOfProject(projectId, user.id);
}

export async function requireProject(
  user: AdminUser,
  projectId: string
): Promise<true | NextResponse> {
  if (await canAccessProject(user, projectId)) return true;
  return denied("This project is not assigned to you", 403);
}

export { projectScopeFilter };
