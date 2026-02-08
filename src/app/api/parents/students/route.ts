/**
 * GET /api/parents/students
 *
 * Get parent&apos;s linked students
 * PARENT role only
 */

// import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getParentStudents } from "@/lib/user-repository";

export const GET = createRBACApiHandler(
  [Role.PARENT],
  async (_req, context) => {
    void _req;
    const students = await getParentStudents(context);
    return jsonResponse(students);
  },
);
