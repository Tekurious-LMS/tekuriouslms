import { prisma } from "@/lib/prisma";
import { UserRole, Prisma } from "@prisma/client";

/**
 * Phase-1 Audit Action Types
 * Only includes actions explicitly required by Phase-1 specification
 */
export type AuditActionType =
  // Admin Actions
  | "CREATE_CLASS"
  | "UPDATE_CLASS"
  | "CREATE_SUBJECT"
  | "UPDATE_SUBJECT"
  | "CREATE_CLASS_SUBJECT_MAPPING"
  | "INVITE_USER"
  // Teacher Actions
  | "CREATE_COURSE"
  | "CREATE_ASSESSMENT"
  | "UPDATE_ASSESSMENT"
  // Student Actions
  | "SUBMIT_ASSESSMENT"
  // System Events
  | "UNAUTHORIZED_ACCESS_ATTEMPT"
  | "TENANT_RESOLUTION_FAILURE";

/**
 * Phase-1 Resource Types
 * Only includes resources that can be audited in Phase-1
 */
export type AuditResourceType =
  | "Class"
  | "Subject"
  | "ClassSubject"
  | "User"
  | "Course"
  | "Assessment"
  | "Submission"
  | "System";

/**
 * Parameters for creating an audit log entry
 */
export interface AuditLogParams {
  tenantId: string;
  actorId: string;
  actorRole: UserRole;
  actionType: AuditActionType;
  resourceType: AuditResourceType;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Centralized Audit Logging Service
 * 
 * Phase-1 Requirements:
 * - Append-only (no updates or deletes)
 * - Tenant-scoped (every log must have tenantId)
 * - Immutable (no API endpoints for modification)
 * - Simple and predictable
 * 
 * Phase-1 Exclusions:
 * - No real-time monitoring
 * - No alerting/notifications
 * - No analytics or dashboards
 * - No retention policies
 * - No GDPR/PII scrubbing
 */
class AuditLogService {
  /**
   * Create an immutable audit log entry
   * 
   * This function is designed to be non-blocking and fail-safe.
   * If logging fails, it logs the error but does not throw,
   * ensuring the main operation continues successfully.
   */
  async log(params: AuditLogParams): Promise<void> {
    try {
      // Validate required fields
      if (!params.tenantId) {
        console.error("[AUDIT LOG] Missing required field: tenantId");
        return;
      }

      if (!params.actorId) {
        console.error("[AUDIT LOG] Missing required field: actorId");
        return;
      }

      if (!params.actorRole) {
        console.error("[AUDIT LOG] Missing required field: actorRole");
        return;
      }

      if (!params.actionType) {
        console.error("[AUDIT LOG] Missing required field: actionType");
        return;
      }

      if (!params.resourceType) {
        console.error("[AUDIT LOG] Missing required field: resourceType");
        return;
      }

      // Create audit log entry
      await prisma.auditLog.create({
        data: {
          tenantId: params.tenantId,
          actorId: params.actorId,
          actorRole: params.actorRole,
          actionType: params.actionType,
          resourceType: params.resourceType,
          resourceId: params.resourceId || null,
          metadata: (params.metadata as Prisma.InputJsonValue) || Prisma.DbNull,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
        },
      });

      // Optional: Log success in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[AUDIT LOG] ${params.actionType} by ${params.actorRole} on ${params.resourceType}`
        );
      }
    } catch (error) {
      // Log error but do not throw
      // This ensures audit logging failures don't break main operations
      console.error("[AUDIT LOG] Failed to create audit log:", error);
    }
  }

  /**
   * Helper function to extract IP address from request headers
   */
  getIpAddress(headers: Headers): string | undefined {
    return (
      headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      headers.get("x-real-ip") ||
      undefined
    );
  }

  /**
   * Helper function to extract User Agent from request headers
   */
  getUserAgent(headers: Headers): string | undefined {
    return headers.get("user-agent") || undefined;
  }
}

// Export singleton instance
export const auditLogService = new AuditLogService();
