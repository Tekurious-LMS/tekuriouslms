import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";


export const GET = authorizedRoute(
  async ({ tenantId }) => {

    const logs = await prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        actorId: true,
        actorRole: true,
        actionType: true,
        resourceType: true,
        resourceId: true,
        metadata: true,
        createdAt: true,
      } as any,
    });

    return NextResponse.json(logs);
  },
  {
    // Only ADMIN can read audit logs
    roles: [UserRole.ADMIN],
  }
);
