import {
  createRBACApiHandler,
  errorResponse,
  jsonResponse,
} from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { prisma } from "@/lib/prisma";
import { rbacRoleToDisplay } from "@/lib/role-mapping";
import type { NoticeCategory, Prisma } from "@prisma/client";

const ALLOWED_CATEGORIES: NoticeCategory[] = [
  "GENERAL",
  "URGENT",
  "ACADEMIC",
  "ADMINISTRATIVE",
];

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (_req, context) => {
    void _req;
    const now = new Date();
    const displayRole = rbacRoleToDisplay(context.userRole);

    const where: Prisma.NoticeWhereInput = {
      tenantId: context.tenantId,
    };

    if (context.userRole !== Role.ADMIN) {
      where.publishedAt = { lte: now };
      where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }];
      where.AND = [
        {
          OR: [
            { targetRoles: { array_contains: "All" } },
            displayRole
              ? { targetRoles: { array_contains: displayRole } }
              : { targetRoles: { array_contains: "Student" } },
          ],
        },
      ];
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 100,
    });

    return jsonResponse(notices);
  },
);

export const POST = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER],
  async (req, context) => {
    try {
      const body = await req.json();
      const {
        title,
        content,
        category = "GENERAL",
        targetRoles = ["All"],
        publishNow = true,
        expiresAt,
      } = body as {
        title?: string;
        content?: string;
        category?: NoticeCategory;
        targetRoles?: string[];
        publishNow?: boolean;
        expiresAt?: string | null;
      };

      if (!title?.trim() || !content?.trim()) {
        return errorResponse("Title and content are required", 400);
      }
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return errorResponse("Invalid category", 400);
      }
      if (!Array.isArray(targetRoles) || targetRoles.length === 0) {
        return errorResponse("targetRoles must be a non-empty array", 400);
      }

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          category,
          targetRoles,
          tenantId: context.tenantId,
          createdBy: context.userId,
          publishedAt: publishNow ? new Date() : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

      return jsonResponse(notice, 201);
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to create notice",
        400,
      );
    }
  },
);

