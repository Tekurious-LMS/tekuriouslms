/**
 * Example: Course Detail API with Ownership Enforcement
 * 
 * This demonstrates how to enforce ownership at the resource level.
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { prisma } from "@/lib/prisma";
import {
    requireTeacherCourseAccess,
    requireStudentEnrollment,
} from "@/lib/rbac-ownership";

/**
 * GET /api/courses/[id]
 * Multi-role with ownership enforcement:
 * - ADMIN: Can access any course in tenant
 * - TEACHER: Can only access owned courses
 * - STUDENT: Can only access enrolled courses
 */
export const GET = createRBACApiHandler(
    [Role.ADMIN, Role.TEACHER, Role.STUDENT],
    async (req, context) => {
        const url = new URL(req.url);
        const courseId = url.pathname.split("/").pop();

        if (!courseId) {
            return errorResponse("Course ID required", 400);
        }

        // Ownership enforcement based on role
        if (context.userRole === Role.TEACHER) {
            await requireTeacherCourseAccess(context, courseId);
        } else if (context.userRole === Role.STUDENT) {
            await requireStudentEnrollment(context, courseId);
        }
        // Admin doesn't need ownership check (tenant-scoped)

        // Fetch course
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                tenantId: context.tenantId,
            },
            include: {
                class: true,
                subject: true,
                lessons: {
                    orderBy: { order: "asc" },
                },
                enrollments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            return errorResponse("Course not found", 404);
        }

        return jsonResponse(course);
    }
);

/**
 * PUT /api/courses/[id]
 * Teacher only - Update owned course
 */
export const PUT = createRBACApiHandler(
    [Role.TEACHER],
    async (req, context) => {
        const url = new URL(req.url);
        const courseId = url.pathname.split("/").pop();

        if (!courseId) {
            return errorResponse("Course ID required", 400);
        }

        // Enforce teacher ownership
        await requireTeacherCourseAccess(context, courseId);

        const body = await req.json();
        const { title, description } = body;

        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                title,
                description,
            },
        });

        return jsonResponse(updatedCourse);
    }
);

/**
 * DELETE /api/courses/[id]
 * Teacher only - Delete owned course
 */
export const DELETE = createRBACApiHandler(
    [Role.TEACHER],
    async (req, context) => {
        const url = new URL(req.url);
        const courseId = url.pathname.split("/").pop();

        if (!courseId) {
            return errorResponse("Course ID required", 400);
        }

        // Enforce teacher ownership
        await requireTeacherCourseAccess(context, courseId);

        await prisma.course.delete({
            where: { id: courseId },
        });

        return jsonResponse({ message: "Course deleted successfully" });
    }
);
