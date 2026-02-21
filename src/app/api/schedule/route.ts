import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/rbac-types";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (_req, context) => {
    void _req;
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    const end = new Date(now);
    end.setDate(now.getDate() + 30);

    let classIds: string[] | undefined;

    if (context.userRole === Role.STUDENT) {
      const profile = await prisma.studentProfile.findFirst({
        where: { userId: context.userId, tenantId: context.tenantId },
        select: { classId: true },
      });
      classIds = profile ? [profile.classId] : [];
    } else if (context.userRole === Role.PARENT) {
      const mappings = await prisma.parentMapping.findMany({
        where: { parentUserId: context.userId, tenantId: context.tenantId },
        include: {
          student: { include: { studentProfile: { select: { classId: true } } } },
        },
      });
      classIds = mappings
        .map((m) => m.student.studentProfile?.classId)
        .filter((id): id is string => !!id);
    }

    const items = await prisma.scheduledClass.findMany({
      where: {
        tenantId: context.tenantId,
        scheduledAt: { gte: start, lte: end },
        ...(context.userRole === Role.TEACHER ? { teacherId: context.userId } : {}),
        ...(classIds ? { course: { classId: { in: classIds } } } : {}),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            class: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true } },
          },
        },
        teacher: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: "asc" },
      take: 200,
    });

    return jsonResponse(items);
  },
);

