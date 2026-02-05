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
            // Handle SignUp: Create Domain User and Role
            if (ctx.path === "/sign-up/email") {
                const responseBody = ctx.context.responseBody as any;
                const user = responseBody?.user;
                const { email, name, image } = user || {};
                const { role, tenantId } = ctx.body as any; // Passed from client during signup

                if (email && role && tenantId) {
                    // 1. Find Better Auth User
                    const betterAuthUser = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (betterAuthUser) {
                        try {
                            // 2. Check if Domain User exists
                            const existingUser = await prisma.domainUser.findFirst({
                                where: { authUserId: betterAuthUser.id }
                            });

                            if (!existingUser) {
                                // 3. Create Domain User
                                await prisma.domainUser.create({
                                    data: {
                                        name: name || "New User",
                                        email: email,
                                        role: role, // Expecting UserRole enum string
                                        tenantId: tenantId,
                                        authUserId: betterAuthUser.id,
                                        avatar: image
                                    }
                                });
                                console.log(`[AUTH HOOK] Created Domain User for ${email}`);
                            }
                        } catch (error) {
                            console.error("[AUTH HOOK] Error creating Domain User:", error);
                        }
                    }
                }
            }

            // Enrich session data
            if (ctx.path === "/get-session" && ctx.context.session) {
                const session = ctx.context.session;
                const userId = session.user.id;

                const domainUser = await prisma.domainUser.findUnique({
                    where: { authUserId: userId },
                    include: {
                        tenant: true
                    }
                });

                if (!domainUser) {
                    (session.user as any).role = null;
                    (session.user as any).tenantId = null;
                    return;
                }

                (session.user as any).id = domainUser.id; // Switch to Domain ID? Or keep Auth ID? Keeping Auth ID for better-auth compatibility, but might be confusing. 
                // Wait, prompt says "Fetch student analytics... id must equal req.user.id".
                // If we use Domain ID in session, we must be consistent.
                // Better Auth session.user.id is usually the Auth User ID.
                // Let's inject domainId as separate field to be safe, or OVERRIDE if we are sure.
                // Instructed: "user: { id... }"

                (session.user as any).domainId = domainUser.id;
                (session.user as any).role = domainUser.role;
                (session.user as any).tenantId = domainUser.tenantId;
                (session.user as any).avatar = domainUser.avatar;

                // Also attach tenant details to the root response if possible, simplified here
                // Note: Better Auth might strictly type session, we are casting to any.
            }
        })
    }
});

console.log("[AUTH] Better Auth initialized successfully");
