import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !["Student", "Teacher", "Admin", "Parent"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name || "New User";

    // Get default tenant (consistent with auth.ts - use slug 'default')
    const defaultTenant = await prisma.tenant.findUnique({
      where: { slug: "default" },
    });

    if (!defaultTenant) {
      return NextResponse.json(
        { error: "Default tenant not found. Please contact administrator." },
        { status: 500 },
      );
    }

    // Check if LmsUser already exists
    let lmsUser = await prisma.lmsUser.findUnique({
      where: { betterAuthUserId: userId },
    });

    if (!lmsUser) {
      // Create LmsUser
      lmsUser = await prisma.lmsUser.create({
        data: {
          name: userName,
          email: userEmail,
          betterAuthUserId: userId,
          tenantId: defaultTenant.id,
        },
      });
      console.log(`[ONBOARDING API] Created LmsUser: ${lmsUser.id}`);
    }

    // Check if role is already assigned
    const existingRole = await prisma.userRole.findFirst({
      where: { userId: lmsUser.id },
    });

    if (!existingRole) {
      // Find or create the role
      let roleRecord = await prisma.role.findFirst({
        where: { roleName: role },
      });

      if (!roleRecord) {
        roleRecord = await prisma.role.create({
          data: { roleName: role },
        });
        console.log(`[ONBOARDING API] Created Role: ${roleRecord.id}`);
      }

      // Assign role to user
      await prisma.userRole.create({
        data: {
          userId: lmsUser.id,
          roleId: roleRecord.id,
        },
      });
      console.log(
        `[ONBOARDING API] Assigned role ${role} to LmsUser ${lmsUser.id}`,
      );
    }

    // Try to update the Better Auth user's role field (optional, may fail if column doesn't exist)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { role: role },
      });
      console.log(`[ONBOARDING API] Updated Better Auth user role to ${role}`);
    } catch (updateError) {
      console.warn(
        "[ONBOARDING API] Could not update Better Auth user role field:",
        updateError,
      );
      // This is non-critical, the LmsUser role is the source of truth
    }

    return NextResponse.json({
      success: true,
      role: role,
      redirectTo: `/${role.toLowerCase()}/dashboard`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[ONBOARDING API] Error:", error);
      console.error("[ONBOARDING API] Error details:", error?.message);
      return NextResponse.json(
        {
          error: "Failed to assign role",
          details: error?.message || "Unknown error",
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
