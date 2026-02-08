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
                            // 2. Get default tenant (for Phase-1, all users go to default tenant)
                            // TODO: In future, tenant should be determined from signup context
                            const defaultTenant = await prisma.tenant.findUnique({
                                where: { slug: 'default' }
                            });

                            if (!defaultTenant) {
                                console.error("[AUTH HOOK] Default tenant not found!");
                                return;
                            }

                            // 3. Check if LmsUser already exists (idempotency)
                            const existingLmsUser = await prisma.lmsUser.findUnique({
                                where: { betterAuthUserId: betterAuthUser.id }
                            });

                            console.log(`[AUTH HOOK] Existing LmsUser: ${existingLmsUser ? existingLmsUser.id : 'NONE'}`);

                            if (!existingLmsUser) {
                                // 4. Create LmsUser with tenantId
                                const newLmsUser = await prisma.lmsUser.create({
                                    data: {
                                        name: name || betterAuthUser.name || "New User",
                                        email: email,
                                        tenantId: defaultTenant.id,
                                        betterAuthUserId: betterAuthUser.id
                                    }
                                });

                                console.log(`[AUTH HOOK] Created LmsUser: ${newLmsUser.id} for tenant: ${defaultTenant.slug}`);

                                // 5. Assign Role
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

                // Fetch LMS user data with role and tenant information
                const lmsUser = await prisma.lmsUser.findUnique({
                    where: { betterAuthUserId: userId },
                    include: {
                        roles: {
                            include: {
                                role: true
                            }
                        },
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                });

                if (!lmsUser) {
                    // User hasn't completed onboarding or isn't linked
                    (session.user as any).lmsUserId = null;
                    (session.user as any).role = null;
                    (session.user as any).tenantId = null;
                    (session.user as any).tenantSlug = null;
                    (session.user as any).tenantName = null;
                    return;
                }

                const primaryRole = lmsUser.roles?.[0]?.role?.roleName;

                // Enrich session user with custom fields including tenant
                (session.user as any).lmsUserId = lmsUser.id;
                (session.user as any).role = primaryRole || null;
                (session.user as any).tenantId = lmsUser.tenant.id;
                (session.user as any).tenantSlug = lmsUser.tenant.slug;
                (session.user as any).tenantName = lmsUser.tenant.name;
            }
        })
    }
});

console.log("[AUTH] Better Auth initialized successfully");
