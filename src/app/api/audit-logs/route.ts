/**
 * GET /api/audit-logs
 *
 * Fetch audit logs (admin only)
 */

// import { NextResponse } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { prisma } from "@/lib/prisma";
import type { Prisma, ActionType } from ".prisma/client";

export const GET = createRBACApiHandler([Role.ADMIN], async (req, context) => {
  const url = new URL(req.nextUrl.toString());
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const actionType = url.searchParams.get("actionType");
  const actorRole = url.searchParams.get("actorRole");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const where: Prisma.AuditLogWhereInput = {
    tenantId: context.tenantId,
  };

  if (actionType) {
    where.actionType = actionType as ActionType;
  }

  if (actorRole) {
    where.actorRole = actorRole;
  }

  if (startDate || endDate) {
    where.createdAt = {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    };
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return jsonResponse({
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
