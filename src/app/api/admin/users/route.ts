/**
 * GET /api/admin/users
 *
 * Get all users in tenant grouped by role
 * ADMIN role only
 */

// import { NextRequest } from "next/server";
import {
  createRBACApiHandler,
  errorResponse,
  jsonResponse,
} from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getAllUsersByRole } from "@/lib/user-repository";
import { prisma } from "@/lib/prisma";
import { toBackendRole } from "@/lib/role-mapping";

export const GET = createRBACApiHandler([Role.ADMIN], async (req, context) => {
  void req;
  const users = await getAllUsersByRole(context);
  return jsonResponse(users);
});

export const POST = createRBACApiHandler(
  [Role.ADMIN],
  async (req, context) => {
    try {
      const body = (await req.json()) as {
        name?: string;
        email?: string;
        role?: string;
        classId?: string;
      };

      if (!body.name?.trim() || !body.email?.trim() || !body.role?.trim()) {
        return errorResponse("name, email, and role are required", 400);
      }

      const backendRole = toBackendRole(body.role.trim());

      const roleRecord =
        (await prisma.role.findFirst({
          where: { roleName: backendRole },
        })) ??
        (await prisma.role.create({
          data: { roleName: backendRole },
        }));

      const existing = await prisma.lmsUser.findUnique({
        where: { email: body.email.trim().toLowerCase() },
      });
      if (existing) {
        return errorResponse("User already exists with this email", 409);
      }

      const created = await prisma.lmsUser.create({
        data: {
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          tenantId: context.tenantId,
          roles: {
            create: {
              roleId: roleRecord.id,
            },
          },
          ...(body.role.toLowerCase() === "student" && body.classId
            ? {
                studentProfile: {
                  create: {
                    classId: body.classId,
                    tenantId: context.tenantId,
                  },
                },
              }
            : {}),
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          studentProfile: true,
        },
      });

      return jsonResponse(created, 201);
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to create user",
        400,
      );
    }
  },
);
