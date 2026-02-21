import { createRBACApiHandler, jsonResponse } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/rbac-types";

export const GET = createRBACApiHandler(
  [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
  async (_req, context) => {
    void _req;

    if (context.userRole !== Role.ADMIN) {
      return jsonResponse([]);
    }

    const payments = await prisma.payment.findMany({
      where: { tenantId: context.tenantId },
      include: {
        subscription: {
          select: {
            id: true,
            planName: true,
            status: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 100,
    });

    return jsonResponse(payments);
  },
);

