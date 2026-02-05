import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const GET = authorizedRoute(async ({ tenantId, user }) => {
  let assessments: {
    id: string;
    title: string;
    type: string;
    dueDate: Date | null;
    courseId: string;
  }[] = [];

  switch (user.role) {
    case UserRole.ADMIN:
      // ADMIN -> all assessments in tenant
      assessments = await prisma.assessment.findMany({
        where: { tenantId },
        select: {
          id: true,
          title: true,
          type: true,
          dueDate: true,
          courseId: true
        },
        orderBy: { createdAt: 'desc' }
      });
      break;

    case UserRole.TEACHER:
      // TEACHER -> only assessments for their courses
      // Assuming 'createdById' on Course corresponds to the Teacher
      assessments = await prisma.assessment.findMany({
        where: {
          tenantId,
          course: {
            createdById: user.id
          }
        },
        select: {
          id: true,
          title: true,
          type: true,
          dueDate: true,
          courseId: true
        },
        orderBy: { createdAt: 'desc' }
      });
      break;

    case UserRole.STUDENT:
      // STUDENT -> only assessments for their enrolled class
      // 1. Get Student Profile to find Class
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
        select: { classId: true }
      });

      if (!studentProfile?.classId) {
        assessments = [];
        break;
      }

      assessments = await prisma.assessment.findMany({
        where: {
          tenantId,
          course: {
            classId: studentProfile.classId
          }
        },
        select: {
          id: true,
          title: true,
          type: true,
          dueDate: true,
          courseId: true
        },
        orderBy: { createdAt: 'desc' }
      });
      break;

    case UserRole.PARENT:
      // PARENT -> only assessments for linked student(s), read-only
      // 1. Get all children
      const children = await prisma.parentMapping.findMany({
        where: { parentId: user.id },
        select: { studentId: true }
      });

      const studentIds = children.map(c => c.studentId);

      // 2. Get classes for these students
      const studentProfiles = await prisma.studentProfile.findMany({
        where: { userId: { in: studentIds } },
        select: { classId: true }
      });

      const classIds = studentProfiles.map(sp => sp.classId).filter((id): id is string => !!id);

      if (classIds.length === 0) {
        assessments = [];
        break;
      }

      assessments = await prisma.assessment.findMany({
        where: {
          tenantId,
          course: {
            classId: { in: classIds }
          }
        },
        select: {
          id: true,
          title: true,
          type: true,
          dueDate: true,
          courseId: true
        },
        orderBy: { createdAt: 'desc' }
      });
      break;

    default:
      assessments = [];
  }

  return NextResponse.json(assessments);
}, {
  roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT]
});
