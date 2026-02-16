/**
 * RBAC Type Definitions
 *
 * This file defines the locked role enum and capability matrix
 * for the Tekurious LMS RBAC system.
 *
 * CRITICAL: These roles are immutable in Phase-1
 */

/**
 * Locked Role Enum
 * A user has exactly ONE role per session
 */
export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

/**
 * Role Capability Matrix (Source of Truth)
 *
 * This matrix defines what each role CAN and CANNOT do.
 * All authorization decisions must reference this matrix.
 */
export const RoleCapabilities = {
  [Role.ADMIN]: {
    // Allowed
    canManageUsers: true,
    canManageStructure: true,
    canManageTeacherAssignments: true,
    canViewOrgAnalytics: true,
    canViewAuditLogs: true,

    // Forbidden
    canConsumeContent: false,
    canAttemptAssessments: false,
    canTeach: false,
  },

  [Role.TEACHER]: {
    // Allowed
    canManageOwnCourses: true,
    canCreateLessons: true,
    canCreateAssessments: true,
    canViewClassProgress: true,
    canViewAssignedStudents: true,

    // Forbidden
    canManageUsers: false,
    canManageStructure: false,
    canViewOrgAnalytics: false,
    canImpersonateOthers: false,
  },

  [Role.STUDENT]: {
    // Allowed
    canViewEnrolledCourses: true,
    canViewLessons: true,
    canAttemptAssessments: true,
    canViewOwnProgress: true,
    canViewOwnSubmissions: true,

    // Forbidden
    canCreateContent: false,
    canManageAnything: false,
    canViewOtherStudents: false,
  },

  [Role.PARENT]: {
    // Allowed
    canViewLinkedStudents: true,
    canViewStudentProgress: true,
    canViewStudentAssessments: true,

    // Forbidden
    canAccessLessons: false,
    canAttemptAssessments: false,
    canCreateAnything: false,
    canManageAnything: false,
  },
} as const;

/**
 * Type guard to check if a string is a valid Role.
 * Accepts both enum values (ADMIN, TEACHER...) and backend roles (Platform Admin, School Admin)
 * which map to ADMIN.
 */
export function isValidRole(role: string): role is Role {
  if (Object.values(Role).includes(role as Role)) return true;
  // Backend admin roles map to ADMIN
  if (role === "Platform Admin" || role === "School Admin") return true;
  return false;
}

/**
 * Get capabilities for a role
 */
export function getRoleCapabilities(role: Role) {
  return RoleCapabilities[role];
}

/**
 * Check if a role has a specific capability
 */
export function hasCapability(
  role: Role,
  capability: keyof (typeof RoleCapabilities)[Role],
): boolean {
  return RoleCapabilities[role][capability] === true;
}
