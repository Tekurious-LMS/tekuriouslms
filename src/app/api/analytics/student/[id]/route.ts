/**
 * Example: Student Analytics API with Multi-Role Access
 * 
 * Demonstrates complex ownership rules:
 * - STUDENT: Can only view own analytics
 * - PARENT: Can view linked student's analytics
 * - TEACHER: Can view enrolled student's analytics
 * - ADMIN: Can view any student's analytics in tenant
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { prisma } from "@/lib/prisma";
import { requireStudentDataAccess } from "@/lib/rbac-ownership";

/**
 * GET /api/analytics/student/[id]
 * Multi-role with complex ownership enforcement
 */
export const GET = createRBACApiHandler(
    [Role.STUDENT, Role.PARENT, Role.TEACHER, Role.ADMIN],
    async (req, context) => {
        const url = new URL(req.url);
        const studentId = url.pathname.split("/").pop();

        if (!studentId) {
            return errorResponse("Student ID required", 400);
        }

        // Enforce ownership/access rules based on role
        await requireStudentDataAccess(context, studentId);

        // Fetch student analytics
        const analytics = await prisma.studentAnalytics.findMany({
            where: {
                userId: studentId,
                tenantId: context.tenantId,
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Fetch student attempts
        const attempts = await prisma.attempt.findMany({
            where: {
                userId: studentId,
                tenantId: context.tenantId,
            },
            include: {
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        totalMarks: true,
                    },
                },
            },
            orderBy: { submittedAt: "desc" },
            take: 10,
        });

        return jsonResponse({
            studentId,
            analytics,
            recentAttempts: attempts,
        });
    }
);
