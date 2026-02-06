import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * GET /api/audit-logs
 * 
 * Retrieve audit logs for the current tenant
 * 
 * Access Control:
 * - ADMIN only
 * 
 * Tenant Isolation:
 * - Returns only logs for the authenticated user's tenant
 * 
 * Response:
 * - Array of audit log entries sorted by createdAt DESC
 * - Excludes ipAddress and userAgent from response for privacy
 * 
 * Phase-1 Constraints:
 * - No filtering or pagination (basic list only)
 * - No search functionality
 * - No date range filtering
 */
export const GET = authorizedRoute(
  async ({ tenantId }) => {
    // Query audit logs for this tenant only
    const logs = await prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        actorId: true,
        actorRole: true,
        actionType: true,
        resourceType: true,
        resourceId: true,
        metadata: true,
        createdAt: true,
        // Exclude ipAddress and userAgent from response
      },
    });

    return NextResponse.json(logs);
  },
  {
    // Only ADMIN can read audit logs
    roles: [UserRole.ADMIN],
  }
);
