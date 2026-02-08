/**
 * GET /api/assessments/:id
 * 
 * Get assessment for attempt (no correct answers)
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getAssessmentForAttempt } from "@/lib/assessment-repository";

export const GET = createRBACApiHandler(
    [Role.TEACHER, Role.STUDENT],
    async (req, context) => {
        const assessmentId = req.nextUrl.pathname.split("/").filter(Boolean).pop();

        if (!assessmentId) {
            return jsonResponse({ error: "Assessment ID is required" }, 400);
        }

        const assessment = await getAssessmentForAttempt(context, assessmentId);
        return jsonResponse(assessment);
    }
);
