/**
 * POST /api/assessments/:id/submit
 * 
 * Submit assessment (student only, one attempt)
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { submitAssessment } from "@/lib/assessment-repository";

export const POST = createRBACApiHandler(
    [Role.STUDENT],
    async (req, context) => {
        try {
            const assessmentId = req.nextUrl.pathname.split("/").filter(Boolean)[1];

            if (!assessmentId) {
                return errorResponse("Assessment ID is required", 400);
            }

            const body = await req.json();
            const { answers } = body;

            if (!Array.isArray(answers)) {
                return errorResponse("Answers must be an array", 400);
            }

            const result = await submitAssessment(context, assessmentId, answers);
            return jsonResponse(result, 201);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(error.message, 400);
            }
            throw error;
        }
    }
);
