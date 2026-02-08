/**
 * GET /api/users/me
 * 
 * Get current user with role-specific extensions
 * - STUDENT: includes studentProfile
 * - PARENT: includes linkedStudents summary
 * - TEACHER/ADMIN: basic user data
 */

import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getCurrentUser } from "@/lib/user-repository";

export const GET = createRBACApiHandler(
    [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
    async (req, context) => {
        const user = await getCurrentUser(context);
        return jsonResponse(user);
    }
);
