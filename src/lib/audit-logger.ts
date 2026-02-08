/**
 * Centralized Audit Logger
 * 
 * Immutable, append-only audit trail for governance actions
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";

enum ActionType {
    // Admin actions
    CLASS_CREATED = "CLASS_CREATED",
    CLASS_UPDATED = "CLASS_UPDATED",
    SUBJECT_CREATED = "SUBJECT_CREATED",
    SUBJECT_UPDATED = "SUBJECT_UPDATED",
    SUBJECT_MAPPED = "SUBJECT_MAPPED",
    USER_INVITED = "USER_INVITED",

    // Teacher actions
    COURSE_CREATED = "COURSE_CREATED",
    LESSON_CREATED = "LESSON_CREATED",
    ASSESSMENT_CREATED = "ASSESSMENT_CREATED",
}

interface AuditLogInput {
    actionType: ActionType;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, any>;
}

/**
 * Log an audit event
 * 
 * Automatically injects:
 * - actorId (from context.userId)
 * - actorRole (from context.userRole)
 * - tenantId (from context.tenantId)
 * - timestamp (createdAt)
 * 
 * Silent failures: If audit logging fails, business action still succeeds
 */
export async function logAudit(
    context: RBACContext,
    input: AuditLogInput
): Promise<void> {
    try {
        await prisma.auditLog.create({
            data: {
                actorId: context.userId,
                actorRole: context.userRole,
                actionType: input.actionType,
                resourceType: input.resourceType,
                resourceId: input.resourceId,
                metadata: input.metadata,
                tenantId: context.tenantId,
            },
        });
    } catch (error) {
        // Silent failure: Log error but don't throw
        // Business action should succeed even if audit logging fails
        console.error("Audit logging failed:", error);
    }
}

export { ActionType };
