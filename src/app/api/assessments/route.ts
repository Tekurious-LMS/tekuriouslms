/**
 * GET /api/assessments
 *
 * List assessments with role-based filtering
 */

import {
  createRBACApiHandler,
  errorResponse,
  jsonResponse,
} from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { createAssessment, getAssessments } from "@/lib/assessment-repository";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (_req, context) => {
    void _req;
    void context;
    const assessments = await getAssessments(context);
    return jsonResponse(assessments);
  },
);

export const POST = createRBACApiHandler(
  [Role.TEACHER],
  async (req, context) => {
    try {
      const body = (await req.json()) as {
        title?: string;
        courseId?: string;
        dueDate?: string;
        questions?: Array<{
          questionText: string;
          options: string[];
          correctOptionIndex: number;
        }>;
      };

      if (!body.title?.trim() || !body.courseId) {
        return errorResponse("title and courseId are required", 400);
      }
      if (!Array.isArray(body.questions) || body.questions.length === 0) {
        return errorResponse("questions must contain at least one question", 400);
      }

      const assessment = await createAssessment(context, {
        title: body.title.trim(),
        courseId: body.courseId,
        dueDate: body.dueDate,
        questions: body.questions,
      });

      return jsonResponse(assessment, 201);
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to create assessment",
        400,
      );
    }
  },
);
