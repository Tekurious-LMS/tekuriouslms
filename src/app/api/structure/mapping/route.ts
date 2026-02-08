/**
 * POST /api/structure/mapping
 *
 * Create class-subject mapping
 * Admin only
 */

import {
  createRBACApiHandler,
  jsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { createClassSubjectMapping } from "@/lib/structure-repository";

export const POST = createRBACApiHandler([Role.ADMIN], async (req, context) => {
  try {
    const body = await req.json();
    const { classId, subjectId } = body;

    if (!classId || !subjectId) {
      return errorResponse("classId and subjectId are required", 400);
    }

    const mapping = await createClassSubjectMapping(
      context,
      classId,
      subjectId,
    );

    return jsonResponse(mapping, 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    throw error;
  }
});
