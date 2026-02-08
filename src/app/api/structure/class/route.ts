/**
 * POST /api/structure/class
 * 
 * Create or update class
 * Admin only
 */

import { createRBACApiHandler, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { Role } from "@/lib/rbac-types";
import { upsertClass } from "@/lib/structure-repository";

export const POST = createRBACApiHandler(
    [Role.ADMIN],
    async (req, context) => {
        try {
            const body = await req.json();
            const { id, name } = body;

            if (!name || typeof name !== "string" || name.trim().length === 0) {
                return errorResponse("Class name is required", 400);
            }

            const classData = await upsertClass(context, {
                id,
                name: name.trim(),
            });

            return jsonResponse(classData, id ? 200 : 201);
        } catch (error) {
            if (error instanceof Error) {
                return errorResponse(error.message, 400);
            }
            throw error;
        }
    }
);
