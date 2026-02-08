/**
 * GET /api/auth/session
 * 
 * Get current user session context
 * All authenticated users can access this endpoint
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";

export const GET = createRBACApiHandler(
    [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
    async (req, context) => {
        return jsonResponse({
            userId: context.userId,
            role: context.userRole,
            tenantId: context.tenantId,
            tenantSlug: context.tenantSlug,
            name: context.userName,
            email: context.userEmail,
            avatar: null, // Will be populated from user data
        });
    }
);
