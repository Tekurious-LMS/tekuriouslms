import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "./auth-types";
import { normalizeRoleForUI } from "./role-mapping";

/**
 * Get the current Supabase session with LMS user enrichment (role, tenant).
 * Uses getUser() for server-side validation (getSession() user is unvalidated).
 * Role is normalized for UI: Platform Admin / School Admin → "Admin"
 */
export async function getSession(): Promise<{
  user: SessionUser | null;
  session: { id: string; userId: string; expiresAt: Date } | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let lmsUser;
  try {
    lmsUser = await prisma.lmsUser.findUnique({
      where: { authUserId: user.id },
      include: {
        roles: { include: { role: true } },
        tenant: { select: { id: true, name: true, slug: true } },
      },
    });
  } catch (err) {
    console.error("[getSession] Prisma lookup failed:", err);
    lmsUser = null;
  }

  const backendRole = lmsUser?.roles?.[0]?.role?.roleName ?? null;
  const primaryRole = normalizeRoleForUI(backendRole) ?? backendRole;

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email ?? "",
    emailVerified: !!user.email_confirmed_at,
    name: user.user_metadata?.name ?? user.email ?? null,
    image: user.user_metadata?.avatar_url ?? null,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at ?? user.created_at),
    lmsUserId: lmsUser?.id ?? null,
    role: primaryRole,
    tenantId: lmsUser?.tenant?.id ?? null,
    tenantSlug: lmsUser?.tenant?.slug ?? null,
    tenantName: lmsUser?.tenant?.name ?? null,
  };

  return {
    user: sessionUser,
    session: {
      id: user.id,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3600000), // getUser doesn't return expires_at
    },
  };
}

/** API-compatible wrapper for compatibility with existing code */
export const auth = {
  api: {
    getSession: async () => getSession(),
  },
};
