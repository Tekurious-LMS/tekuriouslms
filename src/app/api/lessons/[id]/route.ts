/**
 * GET /api/lessons/:id
 *
 * Get lesson content with enrollment validation
 * TEACHER: Only lessons from own courses
 * STUDENT: Only lessons from enrolled courses
 * PARENT: Forbidden
 */

// import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getLessonById } from "@/lib/course-repository";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT],
  async (req, context) => {
    const lessonId = req.nextUrl.pathname.split("/").pop();

    if (!lessonId) {
      return jsonResponse({ error: "Lesson ID is required" }, 400);
    }

    const lesson = await getLessonById(context, lessonId);
    return jsonResponse(lesson);
  },
);
