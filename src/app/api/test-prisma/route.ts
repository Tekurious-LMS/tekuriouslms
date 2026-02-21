import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/rbac-types";

export const GET = createRBACApiHandler([Role.ADMIN], async (_req, context) => {
  void _req;
  void context;
  try {
    const userCount = await prisma.lmsUser.count();

    return jsonResponse({
      success: true,
      message: "Prisma connection works",
      userCount,
    });
  } catch (error: unknown) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
