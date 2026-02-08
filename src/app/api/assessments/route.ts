/**
 * GET /api/assessments
 *
 * List assessments with role-based filtering
 */

// import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { getAssessments } from "@/lib/assessment-repository";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (_req, context) => {
    void _req;
    void context;
    const assessments = await getAssessments(context);
    return jsonResponse(assessments);
  },
);
