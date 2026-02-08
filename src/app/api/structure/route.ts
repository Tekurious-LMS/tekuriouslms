/**
 * GET /api/structure
 * 
 * Get full academic structure tree
 * Allowed: ADMIN (full access), TEACHER (read-only)
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getFullStructure } from "@/lib/structure-repository";

export const GET = createRBACApiHandler(
    [Role.ADMIN, Role.TEACHER],
    async (req, context) => {
        const structure = await getFullStructure(context);
        return jsonResponse(structure);
    }
);
