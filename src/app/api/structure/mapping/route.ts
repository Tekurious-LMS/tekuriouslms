import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const POST = authorizedRoute(async ({ req, tenantId }) => {
  const body = await req.json();
  const { classId, subjectId } = body;

  if (!classId || !subjectId) {
    return NextResponse.json({ error: "ClassId and SubjectId are required" }, { status: 400 });
  }

  // Validate existence and tenant scope
  const [classEntity, subjectEntity] = await Promise.all([
    prisma.class.findUnique({ where: { id: classId } }),
    prisma.subject.findUnique({ where: { id: subjectId } })
  ]);

  if (!classEntity || classEntity.tenantId !== tenantId) {
    return NextResponse.json({ error: "Class not found or access denied" }, { status: 404 });
  }

  if (!subjectEntity || subjectEntity.tenantId !== tenantId) {
    return NextResponse.json({ error: "Subject not found or access denied" }, { status: 404 });
  }

  // Check duplicate mapping
  const existing = await prisma.classSubject.findFirst({
    where: {
      classId,
      subjectId,
      tenantId
    }
  });

  if (existing) {
    return NextResponse.json({ error: "Mapping already exists" }, { status: 409 });
  }

  const mapping = await prisma.classSubject.create({
    data: {
      classId,
      subjectId,
      tenantId
    }
  });

  return NextResponse.json(mapping, { status: 201 });
}, {
  roles: [UserRole.ADMIN]
});
