import { NextRequest } from "next/server";
import { TenantContext, runWithTenantContext } from "./tenant-context";
import { handleTenantError, TenantNotFoundError } from "./api-errors";
import { prisma } from "./prisma";
import { RBACContext, requireRole } from "./rbac-guard";
import { Role } from "./rbac-types";
import { toRBACRole } from "./role-mapping";
import { handleRBACError, UnauthenticatedError } from "./rbac-errors";
import { auth } from "./auth";

/**
 * Wrap an API route handler with tenant context
 * Validates tenant from x-tenant-slug header and injects it into context
 */
export async function withTenantContext(
  request: NextRequest,
  handler: (context: TenantContext) => Promise<Response>,
): Promise<Response> {
  try {
    // Get tenant slug from header or session (for non-prefixed routes)
    let tenantSlug = request.headers.get("x-tenant-slug");
    if (!tenantSlug) {
      const session = await auth.api.getSession();
      tenantSlug = session?.user?.tenantSlug ?? null;
    }
    if (!tenantSlug) {
      throw new TenantNotFoundError("Tenant slug not found in request headers or session");
    }

    // Validate tenant exists in database
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new TenantNotFoundError(`Tenant not found: ${tenantSlug}`);
    }

    // Create tenant context
    const context: TenantContext = {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      tenantConfig: {
        logo: tenant.logo,
        theme: tenant.themeConfig as Record<string, unknown>,
      },
    };

    // Run handler within tenant context
    return await runWithTenantContext(context, () => handler(context));
  } catch (error) {
    if (error instanceof Error) {
      return handleTenantError(error);
    }
    throw error;
  }
}

/**
 * Create a tenant-aware API route handler
 * This is a higher-order function that wraps your handler with tenant context
 */
export function createTenantApiHandler(
  handler: (req: NextRequest, context: TenantContext) => Promise<Response>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    return await withTenantContext(req, (context) => handler(req, context));
  };
}

/**
 * Helper to create JSON responses
 */
export function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Helper to create error responses
 */
export function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: message }, status);
}

/**
 * RBAC-AWARE API HANDLER
 *
 * Wraps an API route handler with both tenant context AND role-based access control.
 * This is the PRIMARY way to create protected API routes.
 *
 * Order of enforcement:
 * 1. Tenant resolution
 * 2. Authentication
 * 3. RBAC guard (role check)
 * 4. Business logic
 *
 * @param request - Next.js request
 * @param allowedRoles - Array of roles that can access this endpoint
 * @param handler - Handler function that receives RBAC context
 * @returns Response
 */
export async function withRBACContext(
  request: NextRequest,
  allowedRoles: Role[],
  handler: (context: RBACContext) => Promise<Response>,
): Promise<Response> {
  try {
    // Step 1: Authentication (needed for tenant fallback)
    const session = await auth.api.getSession();

    if (!session?.user) {
      throw new UnauthenticatedError("Authentication required");
    }

    // Step 2: Tenant Resolution - header first, then session (for non-prefixed routes)
    let tenantSlug = request.headers.get("x-tenant-slug");
    if (!tenantSlug && session.user.tenantSlug) {
      tenantSlug = session.user.tenantSlug;
    }
    if (!tenantSlug) {
      throw new TenantNotFoundError("Tenant slug not found. Provide x-tenant-slug header or ensure user has tenant.");
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new TenantNotFoundError(`Tenant not found: ${tenantSlug}`);
    }

    // Step 3: Verify user belongs to this tenant (security)
    if (session.user.tenantId && session.user.tenantId !== tenant.id) {
      throw new TenantNotFoundError("User does not belong to this tenant");
    }

    // Get LmsUser with role information
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
      throw new UnauthenticatedError("User not found in this tenant");
    }

    // Get user's role (backend: Platform Admin, School Admin, etc.)
    const backendRole = lmsUser.roles[0]?.role?.roleName ?? null;
    const userRole = toRBACRole(backendRole) as Role;

    if (!userRole) {
      throw new UnauthenticatedError("User role not assigned");
    }

    // Step 3: RBAC Guard
    const rbacContext: RBACContext = {
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

    requireRole(rbacContext, allowedRoles);

    // Step 4: Run handler within context
    return await runWithTenantContext(rbacContext, () => handler(rbacContext));
  } catch (error) {
    // Handle RBAC errors
    if (error instanceof Error && error.name.includes("RBAC")) {
      return handleRBACError(error);
    }
    // Handle tenant errors
    if (error instanceof Error) {
      return handleTenantError(error);
    }
    throw error;
  }
}

/**
 * Create an RBAC-aware API route handler
 * Higher-order function that wraps your handler with RBAC + tenant context
 *
 * @param allowedRoles - Array of roles that can access this endpoint
 * @param handler - Handler function
 * @returns API route handler
 */
export function createRBACApiHandler(
  allowedRoles: Role[],
  handler: (req: NextRequest, context: RBACContext) => Promise<Response>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    return await withRBACContext(req, allowedRoles, (context) =>
      handler(req, context),
    );
  };
}
