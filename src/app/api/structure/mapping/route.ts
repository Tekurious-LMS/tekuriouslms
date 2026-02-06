import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { auditLogService } from "@/lib/audit-log.service";

export const POST = authorizedRoute(async ({ req, tenantId, user }) => {
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

  // Audit Log
  await auditLogService.log({
    tenantId,
    actorId: user.id,
    actorRole: user.role,
    actionType: "CREATE_CLASS_SUBJECT_MAPPING",
    resourceType: "ClassSubject",
    resourceId: mapping.id,
    metadata: { classId, subjectId },
    ipAddress: auditLogService.getIpAddress(req.headers),
    userAgent: auditLogService.getUserAgent(req.headers),
  });

  return NextResponse.json(mapping, { status: 201 });
}, {
  roles: [UserRole.ADMIN]
});
