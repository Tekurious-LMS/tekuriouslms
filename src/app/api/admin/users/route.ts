/**
 * GET /api/admin/users
 * 
 * Get all users in tenant grouped by role
 * ADMIN role only
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getAllUsersByRole } from "@/lib/user-repository";

export const GET = createRBACApiHandler(
    [Role.ADMIN],
    async (req, context) => {
        const users = await getAllUsersByRole(context);
        return jsonResponse(users);
    }
);
