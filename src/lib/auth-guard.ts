import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Better Auth instance
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";

type RouteContext = {
  params: Promise<Record<string, string | string[]>>;
};

type AuthorizedContext = {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
  };
  tenantId: string;
  req: NextRequest;
  params: Record<string, string | string[]>;
};

type AuthorizedHandler = (
  ctx: AuthorizedContext
) => Promise<NextResponse>;

type GuardOptions = {
  roles: UserRole[];
};

export function authorizedRoute(
  handler: AuthorizedHandler,
  options: GuardOptions
) {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      // 1. Tenant Resolution
      const tenantSlug = req.headers.get("x-tenant-slug");

      // For API routes called from client, middleware should verify tenant.
      // But strict enforcement here is safer.
      // We need to resolve tenantId from slug if we only have slug from header.
      // OR the session might have tenantId. 
      // Let's rely on Session primarily for User-Tenant binding.

      // 2. Authentication
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session.user) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // 3. Extract Role and Tenant from Session
      // Note: auth.ts enrichment should put these in session.user
      const user = session.user as any;

      if (!user.tenantId || !user.role) {
        // Fallback: If session not enriched (shouldn't happen if auth.ts is correct),
        // fetch fresh from DB.
        const dbUser = await prisma.domainUser.findUnique({
          where: { authUserId: user.id }, // Use Auth ID to find Domain User
          select: { role: true, tenantId: true, id: true, email: true, name: true }
        });

        if (!dbUser) {
          return NextResponse.json(
            { error: "User not found in tenant context" },
            { status: 403 }
          );
        }

        user.role = dbUser.role;
        user.tenantId = dbUser.tenantId;
        user.domainId = dbUser.id; // Ensure we have domain ID
      }

      // 4. RBAC Check
      if (options.roles.length > 0 && !options.roles.includes(user.role)) {
        return NextResponse.json(
          { error: "Forbidden: Insufficient Permissions" },
          { status: 403 }
        );
      }

      // 5. Tenant Scoping Verify (Optional but good)
      // If x-tenant-slug header exists, verify it matches user.tenantId?
      // For Phase-1, strict user.tenantId usage is sufficient.

      const params = await context.params;

      // 6. Execute Handler with Context
      return await handler({
        user: {
          id: user.domainId || user.id, // Prefer Domain ID
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId
        },
        tenantId: user.tenantId,
        req,
        params
      });

    } catch (error) {
      console.error("[AUTH GUARD] Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
