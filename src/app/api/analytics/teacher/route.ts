/**
 * GET /api/analytics/teacher
 *
 * Get teacher class analytics (aggregated)
 */

// import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getTeacherAnalytics } from "@/lib/progress-repository";

export const GET = createRBACApiHandler(
  [Role.TEACHER],
  async (_req, context) => {
    void _req;
    const analytics = await getTeacherAnalytics(context);
    return jsonResponse(analytics);
  },
);
