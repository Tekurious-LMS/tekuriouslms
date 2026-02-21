import {
  createRBACApiHandler,
  errorResponse,
  jsonResponse,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/rbac-types";
import type { NoticeCategory } from "@prisma/client";

const ALLOWED_CATEGORIES: NoticeCategory[] = [
  "GENERAL",
  "URGENT",
  "ACADEMIC",
  "ADMINISTRATIVE",
];

function getNoticeId(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  return parts[2] ?? null;
}

export const PATCH = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER],
  async (req, context) => {
    const noticeId = getNoticeId(req.nextUrl.pathname);
    if (!noticeId) return errorResponse("Notice ID is required", 400);

    const existing = await prisma.notice.findFirst({
      where: { id: noticeId, tenantId: context.tenantId },
    });
    if (!existing) return errorResponse("Notice not found", 404);
    if (context.userRole === Role.TEACHER && existing.createdBy !== context.userId) {
      return errorResponse("Not authorized to update this notice", 403);
    }

    const body = (await req.json()) as {
      title?: string;
      content?: string;
      category?: NoticeCategory;
      targetRoles?: string[];
      publishNow?: boolean;
      expiresAt?: string | null;
    };

    if (body.category && !ALLOWED_CATEGORIES.includes(body.category)) {
      return errorResponse("Invalid category", 400);
    }

    const updated = await prisma.notice.update({
      where: { id: noticeId },
      data: {
        title: body.title?.trim() ?? undefined,
        content: body.content?.trim() ?? undefined,
        category: body.category,
        targetRoles: body.targetRoles,
        publishedAt:
          typeof body.publishNow === "boolean"
            ? body.publishNow
              ? new Date()
              : null
            : undefined,
        expiresAt:
          body.expiresAt === undefined
            ? undefined
            : body.expiresAt
              ? new Date(body.expiresAt)
              : null,
      },
    });

    return jsonResponse(updated);
  },
);

export const DELETE = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER],
  async (req, context) => {
    const noticeId = getNoticeId(req.nextUrl.pathname);
    if (!noticeId) return errorResponse("Notice ID is required", 400);

    const existing = await prisma.notice.findFirst({
      where: { id: noticeId, tenantId: context.tenantId },
    });
    if (!existing) return errorResponse("Notice not found", 404);
    if (context.userRole === Role.TEACHER && existing.createdBy !== context.userId) {
      return errorResponse("Not authorized to delete this notice", 403);
    }

    await prisma.notice.delete({ where: { id: noticeId } });
    return jsonResponse({ success: true });
  },
);

