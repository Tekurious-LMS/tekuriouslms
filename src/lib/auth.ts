import {
    betterAuth
} from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

console.log("[AUTH] Initializing Better Auth...");

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            // Handle SignUp: Create LMS User and Role
            if (ctx.path === "/sign-up/email") {
                console.log("[AUTH HOOK] Sign-up hook triggered");
                console.log("[AUTH HOOK] ctx.body:", JSON.stringify(ctx.body, null, 2));

                // Better Auth usually returns the user/session in the body
                // Check context for the new user or use the email from body to find them
                const { email, name, role } = ctx.body as any;

                console.log(`[AUTH HOOK] Extracted - email: ${email}, name: ${name}, role: ${role}`);

                if (email && role) {
                    // 1. Find the Better Auth user just created
                    const betterAuthUser = await prisma.user.findUnique({
                        where: { email },
                    });

                    console.log(`[AUTH HOOK] Found Better Auth user: ${betterAuthUser ? betterAuthUser.id : 'NOT FOUND'}`);

                    if (betterAuthUser) {
                        try {
                            // 2. Check if LmsUser already exists (idempotency)
                            const existingLmsUser = await prisma.lmsUser.findUnique({
                                where: { betterAuthUserId: betterAuthUser.id }
                            });

                            console.log(`[AUTH HOOK] Existing LmsUser: ${existingLmsUser ? existingLmsUser.id : 'NONE'}`);

                            if (!existingLmsUser) {
                                // 3. Create LmsUser
                                const newLmsUser = await prisma.lmsUser.create({
                                    data: {
                                        name: name || betterAuthUser.name || "New User",
                                        email: email,
                                        betterAuthUserId: betterAuthUser.id
                                    }
                                });

                                console.log(`[AUTH HOOK] Created LmsUser: ${newLmsUser.id}`);

                                // 4. Assign Role
                                const roleRecord = await prisma.role.findFirst({
                                    where: { roleName: role }
                                });

                                if (roleRecord) {
                                    await prisma.userRole.create({
                                        data: {
                                            userId: newLmsUser.id,
                                            roleId: roleRecord.id
                                        }
                                    });
                                    console.log(`[AUTH HOOK] Assigned existing role ${role} (ID: ${roleRecord.id})`);
                                } else {
                                    // Create role if it doesn't exist
                                    const newRole = await prisma.role.create({
                                        data: { roleName: role }
                                    });
                                    await prisma.userRole.create({
                                        data: {
                                            userId: newLmsUser.id,
                                            roleId: newRole.id
                                        }
                                    });
                                    console.log(`[AUTH HOOK] Created and assigned new role ${role} (ID: ${newRole.id})`);
                                }
                                console.log(`[AUTH HOOK] Successfully created LmsUser and assigned role ${role} for ${email}`);
                            }
                        } catch (error) {
                            console.error("[AUTH HOOK] Error creating LMS User:", error);
                        }
                    }
                } else {
                    console.log("[AUTH HOOK] Missing email or role, skipping LmsUser creation");
                }
            }

            // Enrich session data when session is fetched
            if (ctx.path === "/get-session" && ctx.context.session) {
                const session = ctx.context.session;
                const userId = session.user.id;

                // Fetch LMS user data with role and school information
                const betterAuthUser = await prisma.lmsUser.findUnique({
                    where: { betterAuthUserId: userId },
                    include: {
                        roles: {
                            include: {
                                role: true
                            }
                        }
                    }
                });

                if (!betterAuthUser) {
                    // User hasn't completed onboarding or isn't linked
                    (session.user as any).lmsUserId = null;
                    (session.user as any).role = null;
                    (session.user as any).schoolId = null;
                    (session.user as any).schoolName = null;
                    return;
                }

                // Find school through enrollment check or other relation if available
                // For now, we'll try to find school via checking enrollments in classes
                const enrollment = await prisma.enrollment.findFirst({
                    where: { userId: betterAuthUser.id },
                    include: {
                        course: {
                            include: {
                                subject: {
                                    include: {
                                        class: {
                                            include: {
                                                school: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                const schoolData = enrollment?.course?.subject?.class?.school;
                const primaryRole = betterAuthUser.roles?.[0]?.role?.roleName;

                // Enrich session user with custom fields
                (session.user as any).lmsUserId = betterAuthUser.id;
                (session.user as any).role = primaryRole || null;
                (session.user as any).schoolId = schoolData?.id || null;
                (session.user as any).schoolName = schoolData?.name || null;
            }
        })
    }
});

console.log("[AUTH] Better Auth initialized successfully");
