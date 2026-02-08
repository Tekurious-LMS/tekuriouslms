/**
 * Example: Multi-Role Course API
 * 
 * This demonstrates how to create an API route that supports
 * multiple roles with different access levels.
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { prisma } from "@/lib/prisma";
import { requireTeacherCourseAccess } from "@/lib/rbac-ownership";

/**
 * GET /api/courses
 * Multi-role: ADMIN, TEACHER, STUDENT
 * - ADMIN: See all courses in tenant
 * - TEACHER: See only owned/assigned courses
 * - STUDENT: See only enrolled courses
 */
export const GET = createRBACApiHandler(
    [Role.ADMIN, Role.TEACHER, Role.STUDENT],
    async (req, context) => {
        let courses;

        switch (context.userRole) {
            case Role.ADMIN:
                // Admin sees all courses in tenant
                courses = await prisma.course.findMany({
                    where: { tenantId: context.tenantId },
                    include: {
                        class: true,
                        subject: true,
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });
                break;

            case Role.TEACHER:
                // Teacher sees only owned courses
                courses = await prisma.course.findMany({
                    where: {
                        tenantId: context.tenantId,
                        createdById: context.userId,
                    },
                    include: {
                        class: true,
                        subject: true,
                    },
                });
                break;

            case Role.STUDENT:
                // Student sees only enrolled courses
                courses = await prisma.course.findMany({
                    where: {
                        tenantId: context.tenantId,
                        enrollments: {
                            some: {
                                userId: context.userId,
                            },
                        },
                    },
                    include: {
                        class: true,
                        subject: true,
                    },
                });
                break;

            default:
                return errorResponse("Invalid role", 403);
        }

        return jsonResponse(courses);
    }
);

/**
 * POST /api/courses
 * Teacher only - Create a new course
 */
export const POST = createRBACApiHandler(
    [Role.TEACHER],
    async (req, context) => {
        const body = await req.json();
        const { title, description, classId, subjectId } = body;

        const course = await prisma.course.create({
            data: {
                title,
                description,
                classId,
                subjectId,
                tenantId: context.tenantId,
                createdById: context.userId,
            },
        });

        return jsonResponse(course, 201);
    }
);
