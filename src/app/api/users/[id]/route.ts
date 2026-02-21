import { createRBACApiHandler, errorResponse, jsonResponse } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/rbac-types";

function getUserId(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  return parts[2] ?? null;
}

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (req, context) => {
    const userId = getUserId(req.nextUrl.pathname);
    if (!userId) return errorResponse("User ID is required", 400);

    if (context.userRole === Role.STUDENT && userId !== context.userId) {
      return errorResponse("User not found", 404);
    }
    if (context.userRole === Role.TEACHER && userId !== context.userId) {
      return errorResponse("User not found", 404);
    }
    if (context.userRole === Role.PARENT && userId !== context.userId) {
      const linked = await prisma.parentMapping.findFirst({
        where: {
          parentUserId: context.userId,
          studentUserId: userId,
          tenantId: context.tenantId,
        },
      });
      if (!linked) {
        return errorResponse("User not found", 404);
      }
    }

    const user = await prisma.lmsUser.findFirst({
      where: {
        id: userId,
        tenantId: context.tenantId,
      },
      include: {
        roles: { include: { role: true } },
        studentProfile: { include: { class: true } },
        parentMappings: {
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!user) return errorResponse("User not found", 404);

    return jsonResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      roles: user.roles.map((r) => r.role.roleName),
      studentProfile: user.studentProfile
        ? {
            classId: user.studentProfile.classId,
            className: user.studentProfile.class.name,
            sectionId: user.studentProfile.sectionId,
          }
        : null,
      linkedStudents: user.parentMappings.map((m) => ({
        id: m.student.id,
        name: m.student.name,
        email: m.student.email,
      })),
    });
  },
);

