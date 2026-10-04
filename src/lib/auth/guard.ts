import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import {
  hasSection,
  isFullAccess,
  projectScopeFilter,
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

/** Logged in + full (admin) access. */
export async function requireAdmin(): Promise<AdminUser | NextResponse> {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  if (!isFullAccess(user)) return denied("Admin access required", 403);
  return user;
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
 * A non-admin user may only touch a project they were assigned to
 * (as a member or as the project assignee).
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
