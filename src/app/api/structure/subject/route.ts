/**
 * POST /api/structure/subject
 * 
 * Create or update subject
 * Admin only
 */

import { NextRequest } from "next/server";
import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { upsertSubject } from "@/lib/structure-repository";

export const POST = createRBACApiHandler(
    [Role.ADMIN],
    async (req, context) => {
        try {
            const body = await req.json();
            const { id, name } = body;

            if (!name || typeof name !== "string" || name.trim().length === 0) {
                return errorResponse("Subject name is required", 400);
            }

            const subjectData = await upsertSubject(context, {
                id,
                name: name.trim(),
            });

            return jsonResponse(subjectData, id ? 200 : 201);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(error.message, 400);
            }
            throw error;
        }
    }
);
