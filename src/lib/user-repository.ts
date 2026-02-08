/**
 * User Repository
 *
 * Role-aware user data access layer with ownership enforcement
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ResourceNotFoundError } from "./rbac-errors";

// Infer Prisma model types from client (avoids @prisma/client export resolution)
type StudentProfile = NonNullable<
  Awaited<ReturnType<typeof prisma.studentProfile.findFirst>>
>;
type ParentMapping = NonNullable<
  Awaited<ReturnType<typeof prisma.parentMapping.findFirst>>
>;
type LmsUser = NonNullable<
  Awaited<ReturnType<typeof prisma.lmsUser.findFirst>>
>;

/**
 * User with role-specific extensions
 */
export interface UserWithExtensions {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
  tenantId: string;

  // Student-specific
  studentProfile?: {
    classId: string;
    className: string;
    sectionId: string | null;
  };

  // Parent-specific
  linkedStudents?: Array<{
    id: string;
    name: string;
    className: string;
  }>;
}

/**
 * Get current user with role-specific data
 */
export async function getCurrentUser(
  context: RBACContext,
): Promise<UserWithExtensions> {
  const user = await prisma.lmsUser.findUnique({
    where: {
      id: context.userId,
      tenantId: context.tenantId,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      studentProfile: {
        include: {
          class: true,
        },
      },
      parentMappings: {
        include: {
          student: {
            include: {
              studentProfile: {
                include: {
                  class: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new ResourceNotFoundError("User not found");
  }

  const result: UserWithExtensions = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: context.userRole,
    tenantId: user.tenantId,
  };

  // Add student profile if student
  if (context.userRole === Role.STUDENT && user.studentProfile) {
    result.studentProfile = {
      classId: user.studentProfile.classId,
      className: user.studentProfile.class.name,
      sectionId: user.studentProfile.sectionId,
    };
  }

  // Add linked students if parent
  if (context.userRole === Role.PARENT) {
    result.linkedStudents = user.parentMappings.map(
      (mapping: {
        student: {
          id: string;
          name: string;
          studentProfile: { class: { name: string } } | null;
        };
      }) => ({
        id: mapping.student.id,
        name: mapping.student.name,
        className: mapping.student.studentProfile?.class.name || "N/A",
      }),
    );
  }

  return result;
}

/**
 * Get student profile (student only)
 */
export async function getStudentProfile(
  context: RBACContext,
  userId: string,
): Promise<StudentProfile> {
  // Enforce ownership
  if (context.userRole === Role.STUDENT && userId !== context.userId) {
    throw new ResourceNotFoundError("Profile not found");
  }

  const profile = await prisma.studentProfile.findFirst({
    where: {
      userId,
      tenantId: context.tenantId,
    },
    include: {
      class: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!profile) {
    throw new ResourceNotFoundError("Profile not found");
  }

  return profile;
}

/**
 * Get parent's linked students
 */
export async function getParentStudents(
  context: RBACContext,
): Promise<ParentMapping[]> {
  if (context.userRole !== Role.PARENT) {
    throw new ResourceNotFoundError("Not authorized");
  }

  const mappings = await prisma.parentMapping.findMany({
    where: {
      parentUserId: context.userId,
      tenantId: context.tenantId,
    },
    include: {
      student: {
        include: {
          studentProfile: {
            include: {
              class: true,
            },
          },
        },
      },
    },
  });

  type MappingRow = (typeof mappings)[number];
  return mappings.map((mapping: MappingRow) => ({
    ...mapping,
    student: {
      ...mapping.student,
      studentProfile: mapping.student.studentProfile
        ? {
            ...mapping.student.studentProfile,
            class: mapping.student.studentProfile.class,
          }
        : null,
    },
  }));
}

/**
 * Get all users grouped by role (admin only)
 */
export async function getAllUsersByRole(context: RBACContext): Promise<{
  admins: LmsUser[];
  teachers: LmsUser[];
  students: LmsUser[];
  parents: LmsUser[];
}> {
  if (context.userRole !== Role.ADMIN) {
    throw new ResourceNotFoundError("Not authorized");
  }

  const users = await prisma.lmsUser.findMany({
    where: {
      tenantId: context.tenantId,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      studentProfile: {
        include: {
          class: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const grouped = {
    admins: [] as LmsUser[],
    teachers: [] as LmsUser[],
    students: [] as LmsUser[],
    parents: [] as LmsUser[],
  };

  type UserWithRoles = (typeof users)[number];
  users.forEach((user: UserWithRoles) => {
    const roles = user.roles.map(
      (r: UserWithRoles["roles"][number]) => r.role.roleName as Role,
    );
    const userData = {
      ...user,
      roles: user.roles.map(
        (r: UserWithRoles["roles"][number]) => r.role.roleName as Role,
      ),
    } as unknown as LmsUser;

    switch (roles[0] as Role) {
      case Role.ADMIN:
        grouped.admins.push(userData);
        break;
      case Role.TEACHER:
        grouped.teachers.push(userData);
        break;
      case Role.STUDENT:
        grouped.students.push(userData);
        break;
      case Role.PARENT:
        grouped.parents.push(userData);
        break;
    }
  });

  return grouped;
}
