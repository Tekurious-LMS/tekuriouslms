/**
 * Audit Log Repository
 *
 * Read-only access to audit logs for admin dashboard
 */

import type { Prisma } from ".prisma/client";
import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError } from "./rbac-errors";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorRole: string;
  actionType: string;
  resourceType: string;
  resourceId: string | null;
  metadata: unknown;
  createdAt: Date;
}

export interface AuditLogsResult {
  logs: AuditLogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get audit logs for admin dashboard
 */
export async function getAuditLogs(
  context: RBACContext,
  page = 1,
  limit = 10,
): Promise<AuditLogsResult> {
  if (context.userRole !== Role.ADMIN) {
    throw new ForbiddenError("Only admins can view audit logs");
  }

  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const where: Prisma.AuditLogWhereInput = {
    tenantId: context.tenantId,
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs: logs.map((log) => ({
      id: log.id,
      actorId: log.actorId,
      actorRole: log.actorRole,
      actionType: log.actionType,
      resourceType: log.resourceType,
      resourceId: log.resourceId,
      metadata: log.metadata ?? null,
      createdAt: log.createdAt,
    })),
    pagination: {
      page,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
