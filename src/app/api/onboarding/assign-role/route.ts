import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toBackendRole, UI_ROLES } from "@/lib/role-mapping";

const VALID_UI_ROLES = [
  UI_ROLES.ADMIN,
  UI_ROLES.TEACHER,
  UI_ROLES.STUDENT,
  UI_ROLES.PARENT,
] as const;

type ValidUiRole = (typeof VALID_UI_ROLES)[number];

function isValidUiRole(role: string): role is ValidUiRole {
  return (VALID_UI_ROLES as readonly string[]).includes(role);
}

export async function POST(request: NextRequest) {
  try {
    void request;
    // Get the authenticated session
    const session = await auth.api.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { role: uiRole, tenantSlug, tenantId } = body as {
      role?: string;
      tenantSlug?: string;
      tenantId?: string;
    };

    if (!uiRole || !isValidUiRole(uiRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Map UI role to backend: Admin → Platform Admin
    const role = toBackendRole(uiRole);

    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name || "New User";

    // Check if LmsUser already exists
    let lmsUser = await prisma.lmsUser.findUnique({
      where: { authUserId: userId },
    });

    const resolveTenant = async () => {
      if (tenantId) {
        return prisma.tenant.findUnique({ where: { id: tenantId } });
      }
      if (tenantSlug) {
        return prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      }
      if (lmsUser?.tenantId) {
        return prisma.tenant.findUnique({ where: { id: lmsUser.tenantId } });
      }
      if (process.env.DEFAULT_TENANT_SLUG) {
        return prisma.tenant.findUnique({
          where: { slug: process.env.DEFAULT_TENANT_SLUG },
        });
      }
      return null;
    };

    const selectedTenant = await resolveTenant();
    if (!selectedTenant) {
      return NextResponse.json(
        {
          error:
            "Tenant is required. Provide tenantSlug or configure DEFAULT_TENANT_SLUG.",
        },
        { status: 400 },
      );
    }

    if (!lmsUser) {
      // Create LmsUser
      lmsUser = await prisma.lmsUser.create({
        data: {
          name: userName,
          email: userEmail,
          authUserId: userId,
          tenantId: selectedTenant.id,
        },
      });
      console.log(`[ONBOARDING API] Created LmsUser: ${lmsUser.id}`);
    } else if (lmsUser.tenantId !== selectedTenant.id) {
      return NextResponse.json(
        {
          error:
            "User is already associated with a different tenant. Tenant reassignment is blocked here.",
        },
        { status: 409 },
      );
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

    // Redirect uses UI role (admin, teacher, etc.)
    const redirectRole = uiRole.toLowerCase();
    return NextResponse.json({
      success: true,
      role: uiRole,
      tenant: {
        id: selectedTenant.id,
        slug: selectedTenant.slug,
        name: selectedTenant.name,
      },
      redirectTo: `/${redirectRole}/dashboard`,
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
