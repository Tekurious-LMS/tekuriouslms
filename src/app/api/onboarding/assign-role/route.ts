import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        // Get the authenticated session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { role } = body;

        if (!role || !["Student", "Teacher", "Admin", "Parent"].includes(role)) {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        const userId = session.user.id;
        const userEmail = session.user.email;
        const userName = session.user.name || "New User";

        // Determine Tenant (Phase-1: Default to first found or create one)
        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            console.log("[ONBOARDING API] No tenant found. Creating default tenant.");
            tenant = await prisma.tenant.create({
                data: {
                    name: "Default School",
                    slug: "default-school",
                }
            });
        }

        // Check if DomainUser already exists
        let domainUser = await prisma.domainUser.findUnique({
            where: { authUserId: userId }
        });

        const targetRole = role.toUpperCase() as "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

        if (!domainUser) {
            // Create DomainUser
            domainUser = await prisma.domainUser.create({
                data: {
                    name: userName,
                    email: userEmail,
                    authUserId: userId,
                    tenantId: tenant.id,
                    role: targetRole
                }
            });
            console.log(`[ONBOARDING API] Created DomainUser: ${domainUser.id}`);
        } else {
            // Update role if exists (optional, or error if already assigned?)
            // For now, allow updating role during onboarding if not set or overriding
            await prisma.domainUser.update({
                where: { id: domainUser.id },
                data: { role: targetRole }
            });
            console.log(`[ONBOARDING API] Updated DomainUser role: ${domainUser.id} to ${targetRole}`);
        }

        // Try to update the Better Auth user's role field
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { role: role.toLowerCase() } // BetterAuth might use lowercase? Schema says String? @default("student")
            });
            // However, schema user.role is String? @default("student"). 
            // Ideally we align this.
        } catch (updateError) {
            console.warn("[ONBOARDING API] Could not update Better Auth user role:", updateError);
        }

        return NextResponse.json({
            success: true,
            role: role,
            redirectTo: `/${role.toLowerCase()}/dashboard`
        });

    } catch (error: any) {
        console.error("[ONBOARDING API] Error:", error);
        return NextResponse.json(
            { error: "Failed to assign role", details: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}
