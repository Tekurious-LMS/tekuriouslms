/**
 * GET /api/courses/:id
 *
 * Get course details with ownership/enrollment validation
 */

// import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getCourseById } from "@/lib/course-repository";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (req, context) => {
    void req;
    void context;
    const courseId = req.nextUrl.pathname.split("/").pop();

    if (!courseId) {
      return jsonResponse({ error: "Course ID is required" }, 400);
    }

    const course = await getCourseById(context, courseId);
    return jsonResponse(course);
  },
);
