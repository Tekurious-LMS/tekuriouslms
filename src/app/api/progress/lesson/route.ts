/**
 * POST /api/progress/lesson
 * 
 * Update lesson progress (student only)
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { updateLessonProgress } from "@/lib/progress-repository";

export const POST = createRBACApiHandler(
    [Role.STUDENT],
    async (req, context) => {
        try {
            const body = await req.json();
            const { lessonId, status } = body;

            if (!lessonId || !status) {
                return errorResponse("lessonId and status are required", 400);
            }

            if (!["IN_PROGRESS", "COMPLETED"].includes(status)) {
                return errorResponse("Invalid status", 400);
            }

            const progress = await updateLessonProgress(context, lessonId, status);
            return jsonResponse(progress, 200);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(error.message, 400);
            }
            throw error;
        }
    }
);
