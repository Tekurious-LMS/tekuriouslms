/**
 * GET /api/courses/:id/students
 *
 * Get students enrolled in a course (classId match)
 * ADMIN: any course; TEACHER: own course only
 */

import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getCourseStudents } from "@/lib/course-repository";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER],
  async (req, context) => {
    const courseId = req.nextUrl.pathname.split("/")[3];
    if (!courseId) {
      return jsonResponse({ error: "Course ID is required" }, 400);
    }
    const students = await getCourseStudents(context, courseId);
    return jsonResponse(students);
  },
);
