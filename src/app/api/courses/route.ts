/**
 * GET /api/courses
 * POST /api/courses
 * 
 * List and create courses with role-based filtering
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getCourses, createCourse } from "@/lib/course-repository";

export const GET = createRBACApiHandler(
    [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
    async (req, context) => {
        const courses = await getCourses(context);
        return jsonResponse(courses);
    }
);

export const POST = createRBACApiHandler(
    [Role.TEACHER],
    async (req, context) => {
        try {
            const body = await req.json();
            const { title, description, coverImage, classId, subjectId } = body;

            if (!title || typeof title !== "string" || title.trim().length === 0) {
                return errorResponse("Course title is required", 400);
            }

            if (!classId || !subjectId) {
                return errorResponse("classId and subjectId are required", 400);
            }

            const course = await createCourse(context, {
                title: title.trim(),
                description,
                coverImage,
                classId,
                subjectId,
            });

            return jsonResponse(course, 201);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(error.message, 400);
            }
            throw error;
        }
    }
);
