/**
 * GET /api/analytics/student/:id
 * 
 * Get student progress summary
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getStudentProgress } from "@/lib/progress-repository";

export const GET = createRBACApiHandler(
    [Role.STUDENT, Role.PARENT, Role.ADMIN],
    async (req, context) => {
        const studentId = req.nextUrl.pathname.split("/").filter(Boolean).pop();

        if (!studentId) {
            return jsonResponse({ error: "Student ID is required" }, 400);
        }

        const progress = await getStudentProgress(context, studentId);
        return jsonResponse(progress);
    }
);
