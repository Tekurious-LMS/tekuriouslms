import { prisma } from "./src/lib/prisma";

async function test() {
  const log = await prisma.auditLog.findFirst();
  if (log) {
    // Check if actorId is available on the result
    console.log(log.actorId);
  }

  const logs = await prisma.auditLog.findMany({
    select: {
      // @ts-expect-error - testing if this exists
      actorId: true,
      id: true
    }
  });
}
