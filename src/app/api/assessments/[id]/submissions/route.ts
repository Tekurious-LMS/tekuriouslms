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
        // Extract assessment ID from path: /api/assessments/:id/submissions
        // Split: ["", "api", "assessments", ":id", "submissions"]
        // Index 2 is the ID (after filtering empty strings)
        const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
        const assessmentId = pathSegments[2]; // ["api", "assessments", ":id", "submissions"] -> index 2

        if (!assessmentId) {
            return jsonResponse({ error: "Assessment ID is required" }, 400);
        }

        const submissions = await getSubmissions(context, assessmentId);
        return jsonResponse(submissions);
    }
);
