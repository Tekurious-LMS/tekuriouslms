/**
 * Centralized RBAC Guard
 * 
 * This is the single source of truth for role-based authorization.
 * ALL API routes must use this guard - no exceptions.
 */

import { Role, isValidRole } from "./rbac-types";
import { TenantContext } from "./tenant-context";
import {
    ForbiddenError,
    InvalidRoleError,
    UnauthenticatedError,
} from "./rbac-errors";

/**
 * Extended context with user role information
 */
export interface RBACContext extends TenantContext {
    userId: string;
    userRole: Role;
    userEmail: string;
    userName: string;
}

/**
 * CENTRALIZED RBAC GUARD
 * 
 * Validates that the user's role is in the allowed roles list.
 * This is the ONLY function that should perform role checks.
 * 
 * @param context - RBAC context with user role
 * @param allowedRoles - Array of roles that can access this resource
 * @throws ForbiddenError if role is not allowed
 * @throws InvalidRoleError if role is invalid
 */
export function requireRole(
    context: RBACContext,
    allowedRoles: Role[]
): void {
    // Validate role exists
    if (!context.userRole) {
        throw new InvalidRoleError("User role is missing");
    }

    // Validate role is valid
    if (!isValidRole(context.userRole)) {
        throw new InvalidRoleError(`Invalid role: ${context.userRole}`);
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(context.userRole)) {
        throw new ForbiddenError(
            "You do not have permission to access this resource"
        );
    }
}

/**
 * Require user to be authenticated
 * 
 * @param context - RBAC context
 * @throws UnauthenticatedError if user is not authenticated
 */
export function requireAuthentication(context: Partial<RBACContext>): void {
    if (!context.userId || !context.userRole) {
        throw new UnauthenticatedError("Authentication required");
    }
}

/**
 * Require specific role (single role)
 * 
 * @param context - RBAC context
 * @param role - Required role
 * @throws ForbiddenError if user doesn't have the required role
 */
export function requireSpecificRole(context: RBACContext, role: Role): void {
    requireRole(context, [role]);
}

/**
 * Check if user has one of the allowed roles (without throwing)
 * 
 * @param context - RBAC context
 * @param allowedRoles - Array of allowed roles
 * @returns true if user has one of the allowed roles
 */
export function hasRole(context: RBACContext, allowedRoles: Role[]): boolean {
    try {
        requireRole(context, allowedRoles);
        return true;
    } catch {
        return false;
    }
}

/**
 * Require admin role
 * Convenience function for admin-only routes
 */
export function requireAdmin(context: RBACContext): void {
    requireSpecificRole(context, Role.ADMIN);
}

/**
 * Require teacher role
 * Convenience function for teacher-only routes
 */
export function requireTeacher(context: RBACContext): void {
    requireSpecificRole(context, Role.TEACHER);
}

/**
 * Require student role
 * Convenience function for student-only routes
 */
export function requireStudent(context: RBACContext): void {
    requireSpecificRole(context, Role.STUDENT);
}

/**
 * Require parent role
 * Convenience function for parent-only routes
 */
export function requireParent(context: RBACContext): void {
    requireSpecificRole(context, Role.PARENT);
}
