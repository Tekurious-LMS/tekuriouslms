import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const GET = authorizedRoute(async ({ tenantId, user, params }) => {
  const { id } = await params;

  // 1. Fetch Assessment (generic check first)
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: id as string,
      tenantId // Tenant Scope
    },
    select: {
      id: true,
      title: true,
      type: true,
      dueDate: true,
      courseId: true,
      course: {
        select: {
          classId: true,
          createdById: true
        }
      }
    }
  });

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  // 2. Role-Based Access Check
  let hasAccess = false;

  switch (user.role) {
    case UserRole.ADMIN:
      // ADMIN -> read-only
      hasAccess = true;
      break;

    case UserRole.TEACHER:
      // TEACHER -> only if belongs to their course
      if (assessment.course.createdById === user.id) {
        hasAccess = true;
      }
      break;

    case UserRole.STUDENT:
      // STUDENT -> only if enrolled in the course (via Class)
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
        select: { classId: true }
      });

      if (studentProfile?.classId === assessment.course.classId) {
        hasAccess = true;
      }
      break;

    case UserRole.PARENT:
      // PARENT -> only if linked student is enrolled
      // Get all children's classes
      const children = await prisma.parentMapping.findMany({
        where: { parentId: user.id },
        select: { studentId: true }
      });
      const studentIds = children.map(c => c.studentId);

      const studentProfiles = await prisma.studentProfile.findMany({
        where: { userId: { in: studentIds } },
        select: { classId: true }
      });

      const classIds = studentProfiles.map(sp => sp.classId).filter((id): id is string => !!id);

      if (classIds.includes(assessment.course.classId)) {
        hasAccess = true;
      }
      break;
  }

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Return Response (Cleaned up)
  return NextResponse.json({
    id: assessment.id,
    title: assessment.title,
    type: assessment.type,
    dueDate: assessment.dueDate,
    courseId: assessment.courseId
  });

}, {
  roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT]
});
