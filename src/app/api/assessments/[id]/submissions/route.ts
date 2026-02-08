/**
 * GET /api/assessments/:id/submissions
 * 
 * Get submissions for assessment (teacher only)
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getSubmissions } from "@/lib/assessment-repository";

export const GET = createRBACApiHandler(
    [Role.TEACHER],
    async (req, context) => {
        const assessmentId = req.nextUrl.pathname.split("/").filter(Boolean)[1];

        if (!assessmentId) {
            return jsonResponse({ error: "Assessment ID is required" }, 400);
        }

        const submissions = await getSubmissions(context, assessmentId);
        return jsonResponse(submissions);
    }
);
