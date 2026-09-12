export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SALES_EXECUTIVE: "sales_executive",
  SALESPERSON: "salesperson",
  FREELANCER: "freelancer",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 100,
  admin: 80,
  sales_executive: 60,
  salesperson: 40,
  freelancer: 20,
};

export function hasRole(user: { role: string }, roles: string[]): boolean {
  return roles.includes(user.role);
}

export function roleLevel(role: string): number {
  return ROLE_HIERARCHY[role] ?? 0;
}

export function hasMinRole(user: { role: string }, minRole: string): boolean {
  return roleLevel(user.role) >= roleLevel(minRole);
}

export function isSuperAdmin(user: { role: string }): boolean {
  return user.role === ROLES.SUPER_ADMIN;
}

export function isAdmin(user: { role: string }): boolean {
  return user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN;
}

export function isSalesExecutive(user: { role: string }): boolean {
  return hasMinRole(user, ROLES.SALES_EXECUTIVE);
}

export function isSalesperson(user: { role: string }): boolean {
  return user.role === ROLES.SALESPERSON;
}

export function isFreelancer(user: { role: string }): boolean {
  return user.role === ROLES.FREELANCER;
}

export function canManageUsers(user: { role: string }): boolean {
  return isAdmin(user);
}

export function canManagePipelines(user: { role: string }): boolean {
  return isSalesExecutive(user);
}

export function canReassignDeal(user: { role: string }): boolean {
  return isAdmin(user);
}

export function canSeeFinancials(user: { role: string }): boolean {
  return isAdmin(user);
}

export function canSeeReports(user: { role: string }): boolean {
  return isAdmin(user);
}

export function canManageStages(user: { role: string }): boolean {
  return isSalesExecutive(user);
}

export function canAddDealsToPipeline(user: { role: string }): boolean {
  return isSalesExecutive(user);
}

export function canEditDeal(user: { role: string }, dealOwnerId: string, userId: string): boolean {
  if (isAdmin(user)) return true;
  if (isSalesExecutive(user)) return true;
  return dealOwnerId === userId;
}

export function canMoveDeal(user: { role: string }): boolean {
  return isSalesExecutive(user) || isSalesperson(user);
}

export function canDeleteDeal(user: { role: string }): boolean {
  return isAdmin(user);
}

export function getVisibleNavItems(role: string): string[] {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return ["dashboard", "pipelines", "projects", "users", "clients", "pages"];
    case ROLES.ADMIN:
      return ["dashboard", "pipelines", "projects", "users", "clients"];
    case ROLES.SALES_EXECUTIVE:
      return ["dashboard", "pipelines", "projects", "clients"];
    case ROLES.SALESPERSON:
      return ["dashboard", "pipelines", "projects"];
    case ROLES.FREELANCER:
      return ["projects"];
    default:
      return ["dashboard"];
  }
}

export function canManageProjects(user: { role: string }): boolean {
  return isAdmin(user);
}

export function canDeleteProject(user: { role: string }): boolean {
  return isAdmin(user);
}

export function canAccessProjectTabs(role: string): {
  profile: boolean;
  work: boolean;
  submissions: boolean;
  reports: boolean;
} {
  const isAdminOrAbove = isAdmin({ role });
  return {
    profile: true,
    work: true,
    submissions: true,
    reports: isAdminOrAbove,
  };
}
