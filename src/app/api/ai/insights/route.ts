import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { UserRole } from "@prisma/client";

/**
 * Phase-2 AI Insights Route
 */
export const GET = authorizedRoute(
  async () => {
    return NextResponse.json({
      status: "NOT_IMPLEMENTED",
      message: "AI insights will be enabled in Phase-2",
      phase: "PHASE_2"
    });
  },
  {
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  }
);

export const POST = authorizedRoute(
  async () => {
    return NextResponse.json(
      { error: "Feature not available in Phase-1" },
      { status: 403 }
    );
  },
  {
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  }
);
