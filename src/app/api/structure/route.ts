import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const GET = authorizedRoute(async ({ tenantId }) => {
  const classes = await prisma.class.findMany({
    where: { tenantId },
    include: {
      sections: {
        where: { tenantId, isActive: true }
      },
      subjects: {
        where: { tenantId },
        include: {
          subject: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const subjects = await prisma.subject.findMany({
    where: { tenantId },
    orderBy: { name: 'asc' }
  });

  const structure = {
    classes: classes.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      isActive: c.isActive,
      sections: c.sections,
      mappedSubjects: c.subjects.map(cs => cs.subject)
    })),
    subjects: subjects,
    // Raw Mappings if needed separately
    mappings: classes.flatMap(c => c.subjects.map(s => ({
      classId: c.id,
      subjectId: s.subjectId,
      id: s.id
    })))
  };

  return NextResponse.json(structure);
}, {
  roles: [UserRole.ADMIN]
});
