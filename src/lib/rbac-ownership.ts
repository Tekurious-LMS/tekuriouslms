/**
 * RBAC Ownership Enforcement
 *
 * Hierarchy and ownership validation for role-based access control.
 * These functions enforce that users can only access resources they own or are authorized to access.
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError, ResourceNotFoundError } from "./rbac-errors";

/**
 * Require resource ownership
 * Generic ownership check - user must own the resource
 *
 * @param context - RBAC context
 * @param resourceOwnerId - ID of the resource owner
 * @throws ResourceNotFoundError if user doesn't own the resource (404 to not leak existence)
 */
export async function requireOwnership(
  context: RBACContext,
  resourceOwnerId: string,
): Promise<void> {
  if (context.userId !== resourceOwnerId) {
    throw new ResourceNotFoundError("Resource not found");
  }
}

/**
 * TEACHER OWNERSHIP CHECKS
 */

/**
 * Require teacher to own or be assigned to a course
 *
 * @param context - RBAC context (must be TEACHER role)
 * @param courseId - Course ID to check
 * @throws ForbiddenError if not a teacher
 * @throws ResourceNotFoundError if teacher doesn't have access to course
 */
export async function requireTeacherCourseAccess(
  context: RBACContext,
  courseId: string,
): Promise<void> {
  if (context.userRole !== Role.TEACHER) {
    throw new ForbiddenError("Only teachers can access this resource");
  }

  // Check if teacher created the course or is assigned to it
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      tenantId: context.tenantId,
      OR: [
        { teacherId: context.userId },
        // TODO: Add teacher assignment check when TeacherAssignment table exists
      ],
    },
  });

  if (!course) {
    throw new ResourceNotFoundError("Course not found");
  }
}

/**
 * Require teacher to have access to a student (via enrollment in teacher's course)
 *
 * @param context - RBAC context (must be TEACHER role)
 * @param studentId - Student ID to check
 * @throws ForbiddenError if not a teacher
 * @throws ResourceNotFoundError if teacher doesn't have access to student
 */
export async function requireTeacherStudentAccess(
  context: RBACContext,
  studentId: string,
): Promise<void> {
  if (context.userRole !== Role.TEACHER) {
    throw new ForbiddenError("Only teachers can access this resource");
  }

  // Check if student is enrolled in any of teacher's courses
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: studentId,
      tenantId: context.tenantId,
      course: {
        teacherId: context.userId,
      },
    },
  });

  if (!enrollment) {
    throw new ResourceNotFoundError("Student not found");
  }
}

/**
 * STUDENT OWNERSHIP CHECKS
 */

/**
 * Require student to be enrolled in a course
 *
 * @param context - RBAC context (must be STUDENT role)
 * @param courseId - Course ID to check
 * @throws ForbiddenError if not a student
 * @throws ResourceNotFoundError if student is not enrolled
 */
export async function requireStudentEnrollment(
  context: RBACContext,
  courseId: string,
): Promise<void> {
  if (context.userRole !== Role.STUDENT) {
    throw new ForbiddenError("Only students can access this resource");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId,
      userId: context.userId,
      tenantId: context.tenantId,
    },
  });

  if (!enrollment) {
    throw new ResourceNotFoundError("Course not found");
  }
}

/**
 * Require student to own a submission/attempt
 *
 * @param context - RBAC context (must be STUDENT role)
 * @param attemptId - Attempt ID to check
 * @throws ForbiddenError if not a student
 * @throws ResourceNotFoundError if student doesn't own the attempt
 */
export async function requireStudentAttemptOwnership(
  context: RBACContext,
  attemptId: string,
): Promise<void> {
  if (context.userRole !== Role.STUDENT) {
    throw new ForbiddenError("Only students can access this resource");
  }

  const submission = await prisma.submission.findFirst({
    where: {
      id: attemptId,
      studentId: context.userId,
      tenantId: context.tenantId,
    },
  });

  if (!submission) {
    throw new ResourceNotFoundError("Attempt not found");
  }
}

/**
 * Require access to own student data only
 *
 * @param context - RBAC context (must be STUDENT role)
 * @param studentId - Student ID to check
 * @throws ForbiddenError if not a student or trying to access another student's data
 */
export async function requireOwnStudentData(
  context: RBACContext,
  studentId: string,
): Promise<void> {
  if (context.userRole !== Role.STUDENT) {
    throw new ForbiddenError("Only students can access this resource");
  }

  if (context.userId !== studentId) {
    throw new ResourceNotFoundError("Student not found");
  }
}

/**
 * PARENT OWNERSHIP CHECKS
 */

/**
 * Require parent to be linked to a student
 *
 * @param context - RBAC context (must be PARENT role)
 * @param studentId - Student ID to check
 * @throws ForbiddenError if not a parent
 * @throws ResourceNotFoundError if parent is not linked to student
 */
export async function requireParentStudentLink(
  context: RBACContext,
  studentId: string,
): Promise<void> {
  if (context.userRole !== Role.PARENT) {
    throw new ForbiddenError("Only parents can access this resource");
  }

  // Check if ParentMapping exists
  // Note: ParentMapping table needs to be created in schema
  // For now, we'll check if it exists, otherwise throw error

  try {
    const mapping = await prisma.parentMapping.findFirst({
      where: {
        parentUserId: context.userId,
        studentUserId: studentId,
        tenantId: context.tenantId,
      },
    });

    if (!mapping) {
      throw new ResourceNotFoundError("Student not found");
    }
  } catch {
    // If ParentMapping table doesn't exist, throw error
    throw new ResourceNotFoundError("Student not found");
  }
}

/**
 * ADMIN SCOPE CHECKS
 */

/**
 * Require admin role and tenant scope
 * Admin can access all resources within their tenant
 *
 * @param context - RBAC context (must be ADMIN role)
 * @param resourceTenantId - Tenant ID of the resource
 * @throws ForbiddenError if not an admin or cross-tenant access
 */
export async function requireAdminTenantScope(
  context: RBACContext,
  resourceTenantId: string,
): Promise<void> {
  if (context.userRole !== Role.ADMIN) {
    throw new ForbiddenError("Only admins can access this resource");
  }

  // Ensure resource is in the same tenant
  if (context.tenantId !== resourceTenantId) {
    throw new ResourceNotFoundError("Resource not found");
  }
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Check if user can access a specific student's data
 * Works for: STUDENT (self), PARENT (linked), TEACHER (enrolled), ADMIN (all)
 *
 * @param context - RBAC context
 * @param studentId - Student ID to check
 * @throws ResourceNotFoundError if user cannot access student data
 */
export async function requireStudentDataAccess(
  context: RBACContext,
  studentId: string,
): Promise<void> {
  switch (context.userRole) {
    case Role.STUDENT:
      await requireOwnStudentData(context, studentId);
      break;

    case Role.PARENT:
      await requireParentStudentLink(context, studentId);
      break;

    case Role.TEACHER:
      await requireTeacherStudentAccess(context, studentId);
      break;

    case Role.ADMIN:
      // Admin can access all students in their tenant
      const student = await prisma.lmsUser.findFirst({
        where: {
          id: studentId,
          tenantId: context.tenantId,
        },
      });
      if (!student) {
        throw new ResourceNotFoundError("Student not found");
      }
      break;

    default:
      throw new ForbiddenError("Cannot access student data");
  }
}
