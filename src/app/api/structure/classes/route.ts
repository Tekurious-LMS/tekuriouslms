/**
 * Example: Admin-Only Structure API
 *
 * This demonstrates how to create an admin-only API route
 * using the RBAC system.
 */

import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/structure/classes
 * Admin only - List all classes in the tenant
 */
export const GET = createRBACApiHandler([Role.ADMIN], async (req, context) => {
  const classes = await prisma.class.findMany({
    where: { tenantId: context.tenantId },
    include: {
      school: {
        include: {
          board: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return jsonResponse(classes);
});

/**
 * POST /api/structure/classes
 * Admin only - Create a new class
 */
export const POST = createRBACApiHandler([Role.ADMIN], async (req, context) => {
  const body = await req.json();
  const { name, schoolId } = body;

  const newClass = await prisma.class.create({
    data: {
      name,
      schoolId,
      tenantId: context.tenantId,
    },
  });

  return jsonResponse(newClass, 201);
});
