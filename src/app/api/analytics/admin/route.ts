/**
 * GET /api/analytics/admin
 * 
 * Get admin adoption metrics (aggregated)
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getAdminAnalytics } from "@/lib/progress-repository";

export const GET = createRBACApiHandler(
    [Role.ADMIN],
    async (req, context) => {
        const analytics = await getAdminAnalytics(context);
        return jsonResponse(analytics);
    }
);
