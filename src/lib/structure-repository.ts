/**
 * Academic Structure Repository
 *
 * Admin-only academic structure management with tenant-scoped validation
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError, ResourceNotFoundError } from "./rbac-errors";
import { logAudit, ActionType } from "./audit-logger";
import { Class, Subject, ClassSubject } from "@prisma/client";

/**
 * Structure tree response
 */
export interface StructureTree {
  classes: Array<{
    id: string;
    name: string;
    sections: Array<{
      id: string;
      name: string;
    }>;
    subjects: Array<{
      id: string;
      name: string;
    }>;
  }>;
  subjects: Array<{
    id: string;
    name: string;
  }>;
  mappings: Array<{
    id: string;
    classId: string;
    subjectId: string;
  }>;
}

/**
 * Get full academic structure tree
 * Allowed: ADMIN, TEACHER (read-only)
 */
export async function getFullStructure(
  context: RBACContext,
): Promise<StructureTree> {
  // Only ADMIN and TEACHER can access
  if (![Role.ADMIN, Role.TEACHER].includes(context.userRole)) {
    throw new ForbiddenError("Access denied");
  }

  const [classes, subjects, mappings] = await Promise.all([
    prisma.class.findMany({
      where: { tenantId: context.tenantId },
      include: {
        sections: true,
        classSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      where: { tenantId: context.tenantId },
      orderBy: { name: "asc" },
    }),
    prisma.classSubject.findMany({
      where: { tenantId: context.tenantId },
    }),
  ]);

  return {
    classes: classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      sections: cls.sections.map((s) => ({
        id: s.id,
        name: s.name,
      })),
      subjects: cls.classSubjects.map((cs) => ({
        id: cs.subject.id,
        name: cs.subject.name,
      })),
    })),
    subjects: subjects.map((s) => ({
      id: s.id,
      name: s.name,
    })),
    mappings: mappings.map((m) => ({
      id: m.id,
      classId: m.classId,
      subjectId: m.subjectId,
    })),
  };
}

/**
 * Create or update class
 * Admin only
 */
export async function upsertClass(
  context: RBACContext,
  data: { id?: string; name: string },
): Promise<Class> {
  if (context.userRole !== Role.ADMIN) {
    throw new ForbiddenError("Only admins can modify structure");
  }

  // Validate uniqueness
  await validateClassUniqueness(context.tenantId, data.name, data.id);

  if (data.id) {
    // Update existing
    const existing = await prisma.class.findFirst({
      where: {
        id: data.id,
        tenantId: context.tenantId,
      },
    });

    if (!existing) {
      throw new ResourceNotFoundError("Class not found");
    }

    const updated = await prisma.class.update({
      where: { id: data.id },
      data: { name: data.name },
    });

    // Audit log
    await logAudit(context, {
      actionType: ActionType.CLASS_UPDATED,
      resourceType: "Class",
      resourceId: updated.id,
      metadata: { className: updated.name },
    });

    return updated;
  } else {
    // Create new
    const created = await prisma.class.create({
      data: {
        name: data.name,
        tenantId: context.tenantId,
      },
    });

    // Audit log
    await logAudit(context, {
      actionType: ActionType.CLASS_CREATED,
      resourceType: "Class",
      resourceId: created.id,
      metadata: { className: created.name },
    });

    return created;
  }
}

/**
 * Create or update subject
 * Admin only
 */
export async function upsertSubject(
  context: RBACContext,
  data: { id?: string; name: string },
): Promise<Subject> {
  if (context.userRole !== Role.ADMIN) {
    throw new ForbiddenError("Only admins can modify structure");
  }

  // Validate uniqueness
  await validateSubjectUniqueness(context.tenantId, data.name, data.id);

  if (data.id) {
    // Update existing
    const existing = await prisma.subject.findFirst({
      where: {
        id: data.id,
        tenantId: context.tenantId,
      },
    });

    if (!existing) {
      throw new ResourceNotFoundError("Subject not found");
    }

    const updated = await prisma.subject.update({
      where: { id: data.id },
      data: { name: data.name },
    });

    // Audit log
    await logAudit(context, {
      actionType: ActionType.SUBJECT_UPDATED,
      resourceType: "Subject",
      resourceId: updated.id,
      metadata: { subjectName: updated.name },
    });

    return updated;
  } else {
    // Create new
    const created = await prisma.subject.create({
      data: {
        name: data.name,
        tenantId: context.tenantId,
      },
    });

    // Audit log
    await logAudit(context, {
      actionType: ActionType.SUBJECT_CREATED,
      resourceType: "Subject",
      resourceId: created.id,
      metadata: { subjectName: created.name },
    });

    return created;
  }
}

/**
 * Create class-subject mapping
 * Admin only
 */
export async function createClassSubjectMapping(
  context: RBACContext,
  classId: string,
  subjectId: string,
): Promise<ClassSubject> {
  if (context.userRole !== Role.ADMIN) {
    throw new ForbiddenError("Only admins can modify structure");
  }

  // Validate both belong to same tenant
  const [classData, subjectData] = await Promise.all([
    prisma.class.findFirst({
      where: {
        id: classId,
        tenantId: context.tenantId,
      },
    }),
    prisma.subject.findFirst({
      where: {
        id: subjectId,
        tenantId: context.tenantId,
      },
    }),
  ]);

  if (!classData) {
    throw new ResourceNotFoundError("Class not found");
  }

  if (!subjectData) {
    throw new ResourceNotFoundError("Subject not found");
  }

  // Validate uniqueness
  await validateMappingUniqueness(context.tenantId, classId, subjectId);

  const mapping = await prisma.classSubject.create({
    data: {
      classId,
      subjectId,
      tenantId: context.tenantId,
    },
  });

  // Audit log
  await logAudit(context, {
    actionType: ActionType.SUBJECT_MAPPED,
    resourceType: "ClassSubject",
    resourceId: mapping.id,
    metadata: { classId, subjectId },
  });

  return mapping;
}

/**
 * Validate class name uniqueness per tenant
 */
async function validateClassUniqueness(
  tenantId: string,
  name: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.class.findFirst({
    where: {
      name,
      tenantId,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  if (existing) {
    throw new Error("Class name already exists in this tenant");
  }
}

/**
 * Validate subject name uniqueness per tenant
 */
async function validateSubjectUniqueness(
  tenantId: string,
  name: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.subject.findFirst({
    where: {
      name,
      tenantId,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  if (existing) {
    throw new Error("Subject name already exists in this tenant");
  }
}

/**
 * Validate class-subject mapping uniqueness
 */
async function validateMappingUniqueness(
  tenantId: string,
  classId: string,
  subjectId: string,
): Promise<void> {
  const existing = await prisma.classSubject.findFirst({
    where: {
      classId,
      subjectId,
      tenantId,
    },
  });

  if (existing) {
    throw new Error("This subject is already mapped to this class");
  }
}
