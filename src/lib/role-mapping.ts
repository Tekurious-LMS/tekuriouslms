/**
 * Role Mapping: UI labels ↔ Backend roles
 *
 * UI shows "Admin" for both Platform Admin and School Admin.
 * Backend stores "Platform Admin" or "School Admin" per SOP.
 */

/** Backend role names (stored in DB) */
export const BACKEND_ROLES = {
  PLATFORM_ADMIN: "Platform Admin",
  SCHOOL_ADMIN: "School Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
} as const;

/** UI role labels (displayed to users) */
export const UI_ROLES = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
} as const;

/**
 * Map UI selection → backend role for storage.
 * When user selects "Admin", we store "Platform Admin" by default.
 */
export const UI_TO_BACKEND: Record<string, string> = {
  [UI_ROLES.ADMIN]: BACKEND_ROLES.PLATFORM_ADMIN,
  [UI_ROLES.TEACHER]: BACKEND_ROLES.TEACHER,
  [UI_ROLES.STUDENT]: BACKEND_ROLES.STUDENT,
  [UI_ROLES.PARENT]: BACKEND_ROLES.PARENT,
};

/**
 * Map backend role → UI label for display and routing.
 * Platform Admin and School Admin both display as "Admin".
 */
export const BACKEND_TO_UI: Record<string, string> = {
  [BACKEND_ROLES.PLATFORM_ADMIN]: UI_ROLES.ADMIN,
  [BACKEND_ROLES.SCHOOL_ADMIN]: UI_ROLES.ADMIN,
  [BACKEND_ROLES.TEACHER]: UI_ROLES.TEACHER,
  [BACKEND_ROLES.STUDENT]: UI_ROLES.STUDENT,
  [BACKEND_ROLES.PARENT]: UI_ROLES.PARENT,
};

/** Check if backend role is an admin (Platform or School) */
export function isAdminRole(role: string | null): boolean {
  if (!role) return false;
  return (
    role === BACKEND_ROLES.PLATFORM_ADMIN || role === BACKEND_ROLES.SCHOOL_ADMIN
  );
}

/** Normalize backend role to UI label (for display, routing, session) */
export function normalizeRoleForUI(role: string | null): string | null {
  if (!role) return null;
  return BACKEND_TO_UI[role] ?? role;
}

/** Convert UI role to backend role for storage */
export function toBackendRole(uiRole: string): string {
  return UI_TO_BACKEND[uiRole] ?? uiRole;
}

/** Convert backend role to RBAC enum value (ADMIN, TEACHER, etc.) */
export function toRBACRole(backendRole: string | null): string | null {
  if (!backendRole) return null;
  if (isAdminRole(backendRole)) return "ADMIN";
  const ui = normalizeRoleForUI(backendRole);
  return ui ? ui.toUpperCase() : null;
}

/** Map RBAC enum value to UI display label */
const RBAC_TO_UI: Record<string, string> = {
  ADMIN: UI_ROLES.ADMIN,
  TEACHER: UI_ROLES.TEACHER,
  STUDENT: UI_ROLES.STUDENT,
  PARENT: UI_ROLES.PARENT,
};

/** Normalize RBAC role to UI label for display */
export function rbacRoleToDisplay(rbacRole: string | null): string | null {
  if (!rbacRole) return null;
  return RBAC_TO_UI[rbacRole] ?? rbacRole;
}
