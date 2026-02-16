/**
 * Server-side RBAC context for Server Components
 *
 * Builds RBACContext from session (no request needed).
 * Use for data fetching in async Server Components.
 */

import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { toRBACRole } from "./role-mapping";
import { requireRole } from "./rbac-guard";
import { UnauthenticatedError } from "./rbac-errors";

/**
 * Get RBAC context for the current request (Server Component).
 * Uses React.cache() for per-request deduplication.
 *
 * @returns RBACContext or null if unauthenticated
 */
export const getServerRBACContext = cache(async (): Promise<RBACContext | null> => {
  const session = await auth.api.getSession();

  if (!session?.user) {
    return null;
  }

  const tenantSlug = session.user.tenantSlug;
  if (!tenantSlug) {
    return null;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    return null;
  }

  if (session.user.tenantId && session.user.tenantId !== tenant.id) {
    return null;
  }

  const lmsUser = await prisma.lmsUser.findFirst({
    where: {
      authUserId: session.user.id,
      tenantId: tenant.id,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!lmsUser) {
    return null;
  }

  const backendRole = lmsUser.roles[0]?.role?.roleName ?? null;
  const userRole = toRBACRole(backendRole) as Role;

  if (!userRole) {
    return null;
  }

  return {
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    tenantConfig:
      tenant.themeConfig && typeof tenant.themeConfig === "object"
        ? {
            logo: tenant.logo ?? null,
            theme: tenant.themeConfig as Record<string, unknown> | null,
          }
        : undefined,
    userId: lmsUser.id as string,
    userRole: userRole as Role,
    userEmail: lmsUser.email as string,
    userName: lmsUser.name as string,
  };
});

/**
 * Require RBAC context and role. Throws if unauthenticated or forbidden.
 */
export async function requireServerRBAC(
  allowedRoles: Role[],
): Promise<RBACContext> {
  const context = await getServerRBACContext();
  if (!context) {
    throw new UnauthenticatedError("Authentication required");
  }
  requireRole(context, allowedRoles);
  return context;
}
