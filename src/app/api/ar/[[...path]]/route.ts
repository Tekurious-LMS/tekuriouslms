import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { UserRole } from "@prisma/client";

/**
 * Phase-2 AR/VR Catch-all Route
 * 
 * Rules:
 * - Return NOT_IMPLEMENTED for GET
 * - Return 403 Forbidden for modifcations (POST/PUT/DELETE)
 * - Must pass Tenant & RBAC checks
 */
export const GET = authorizedRoute(
  async () => {
    return NextResponse.json({
      status: "NOT_IMPLEMENTED",
      message: "This feature is planned for a future release (Phase-2).",
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

export const PUT = POST;
export const DELETE = POST;
export const PATCH = POST;
