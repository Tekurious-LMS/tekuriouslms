import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  // Ideally, auth.ts enrichment has already populated tenantId and role.
  // However, if we need to be strictly safe or fetch fresh data:
  const dbUser = await prisma.domainUser.findUnique({
    where: { authUserId: user.id },
    include: { tenant: true }
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User context not found" }, { status: 404 });
  }

  const responsePayload = {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      avatar: dbUser.avatar,
      tenantId: dbUser.tenantId
    },
    tenant: {
      id: dbUser.tenant.id,
      name: dbUser.tenant.name,
      slug: dbUser.tenant.slug,
      logo: dbUser.tenant.logo,
      themeConfig: dbUser.tenant.themeConfig
    }
  };

  return NextResponse.json(responsePayload);
}
