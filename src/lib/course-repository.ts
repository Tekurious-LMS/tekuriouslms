/**
 * Course Repository
 *
 * Teacher-owned course management with enrollment validation
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError, ResourceNotFoundError } from "./rbac-errors";
import { logAudit, ActionType } from "./audit-logger";

// Infer Course/Lesson from Prisma client (avoids Prisma 7 export resolution issues)
type Course = NonNullable<Awaited<ReturnType<typeof prisma.course.findFirst>>>;
type Lesson = NonNullable<Awaited<ReturnType<typeof prisma.lesson.findFirst>>>;

/**
 * Get courses (role-filtered)
 */
export async function getCourses(context: RBACContext): Promise<Course[]> {
  // ADMIN: All courses in tenant
  if (context.userRole === Role.ADMIN) {
    return await prisma.course.findMany({
      where: { tenantId: context.tenantId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // TEACHER: Own courses only
  if (context.userRole === Role.TEACHER) {
    return await prisma.course.findMany({
      where: {
        teacherId: context.userId,
        tenantId: context.tenantId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // STUDENT: Enrolled courses (classId match)
  if (context.userRole === Role.STUDENT) {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId: context.userId,
        tenantId: context.tenantId,
      },
    });

    if (!studentProfile) {
      return [];
    }

    return await prisma.course.findMany({
      where: {
        classId: studentProfile.classId,
        tenantId: context.tenantId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // PARENT: Courses linked to child (metadata only)
  if (context.userRole === Role.PARENT) {
    const parentMappings = await prisma.parentMapping.findMany({
      where: {
        parentUserId: context.userId,
        tenantId: context.tenantId,
      },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
      },
    });

    const classIds = parentMappings
      .map(
        (m: { student: { studentProfile: { classId: string } | null } }) =>
          m.student.studentProfile?.classId,
      )
      .filter((id: string | undefined): id is string => !!id);

    if (classIds.length === 0) {
      return [];
    }

    return await prisma.course.findMany({
      where: {
        classId: { in: classIds },
        tenantId: context.tenantId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return [];
}

/**
 * Get course by ID (ownership/enrollment validated)
 */
export async function getCourseById(
  context: RBACContext,
  courseId: string,
): Promise<Course> {
  // ADMIN: Any course in tenant
  if (context.userRole === Role.ADMIN) {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        tenantId: context.tenantId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { orderIndex: "asc" },
        },
        lessons: {
          where: { moduleId: null },
        },
      },
    });

    if (!course) {
      throw new ResourceNotFoundError("Course not found");
    }

    return course;
  }

  // TEACHER: Only own course
  if (context.userRole === Role.TEACHER) {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: context.userId,
        tenantId: context.tenantId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { orderIndex: "asc" },
        },
        lessons: {
          where: { moduleId: null },
        },
      },
    });

    if (!course) {
      throw new ResourceNotFoundError("Course not found");
    }

    return course as Course;
  }

  // STUDENT: Only enrolled course
  if (context.userRole === Role.STUDENT) {
    const isEnrolled = await isStudentEnrolled(
      context.userId,
      courseId,
      context.tenantId,
    );

    if (!isEnrolled) {
      throw new ResourceNotFoundError("Course not found");
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        tenantId: context.tenantId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { orderIndex: "asc" },
        },
        lessons: {
          where: { moduleId: null },
        },
      },
    });

    if (!course) {
      throw new ResourceNotFoundError("Course not found");
    }

    return course;
  }

  // PARENT: Metadata only, no lessons
  if (context.userRole === Role.PARENT) {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        tenantId: context.tenantId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!course) {
      throw new ResourceNotFoundError("Course not found");
    }

    return course;
  }

  throw new ForbiddenError("Access denied");
}

/**
 * Create course (teacher only)
 */
export async function createCourse(
  context: RBACContext,
  data: {
    title: string;
    description?: string;
    coverImage?: string;
    classId: string;
    subjectId: string;
  },
): Promise<Course> {
  if (context.userRole !== Role.TEACHER) {
    throw new ForbiddenError("Only teachers can create courses");
  }

  // Validate class-subject mapping exists
  await validateClassSubjectMapping(
    context.tenantId,
    data.classId,
    data.subjectId,
  );

  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      teacherId: context.userId,
      classId: data.classId,
      subjectId: data.subjectId,
      tenantId: context.tenantId,
    },
    include: {
      class: {
        select: {
          id: true,
          name: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Audit log
  await logAudit(context, {
    actionType: ActionType.COURSE_CREATED,
    resourceType: "Course",
    resourceId: course.id,
    metadata: {
      courseTitle: course.title,
      classId: course.classId,
      subjectId: course.subjectId,
    },
  });

  return course as Course;
}

/**
 * Get lesson by ID (enrollment validated)
 */
export async function getLessonById(
  context: RBACContext,
  lessonId: string,
): Promise<Lesson> {
  // Parent cannot access lesson content
  if (context.userRole === Role.PARENT) {
    throw new ForbiddenError("Parents cannot access lesson content");
  }

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      tenantId: context.tenantId,
    },
    include: {
      course: {
        select: {
          id: true,
          teacherId: true,
          classId: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new ResourceNotFoundError("Lesson not found");
  }

  // TEACHER: Only lessons from own courses
  if (context.userRole === Role.TEACHER) {
    if (lesson.course.teacherId !== context.userId) {
      throw new ResourceNotFoundError("Lesson not found");
    }
  }

  // STUDENT: Only lessons from enrolled courses
  if (context.userRole === Role.STUDENT) {
    const isEnrolled = await isStudentEnrolled(
      context.userId,
      lesson.courseId,
      context.tenantId,
    );

    if (!isEnrolled) {
      throw new ResourceNotFoundError("Lesson not found");
    }
  }

  return lesson as Lesson;
}

/**
 * Validate class-subject mapping exists
 */
async function validateClassSubjectMapping(
  tenantId: string,
  classId: string,
  subjectId: string,
): Promise<void> {
  const mapping = await prisma.classSubject.findFirst({
    where: {
      classId,
      subjectId,
      tenantId,
    },
  });

  if (!mapping) {
    throw new Error("Subject is not mapped to this class");
  }
}

/**
 * Check if student is enrolled in course (implicit enrollment via classId match)
 */
async function isStudentEnrolled(
  userId: string,
  courseId: string,
  tenantId: string,
): Promise<boolean> {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId,
      tenantId,
    },
  });

  if (!studentProfile) {
    return false;
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      tenantId,
    },
  });

  if (!course) {
    return false;
  }

  // Enrollment = classId match
  return studentProfile.classId === course.classId;
}

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  status?: string;
}

/**
 * Get students enrolled in a course (classId match)
 * ADMIN: any course; TEACHER: own course only
 */
export async function getCourseStudents(
  context: RBACContext,
  courseId: string,
): Promise<CourseStudent[]> {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      tenantId: context.tenantId,
    },
    select: { classId: true, teacherId: true },
  });

  if (!course) {
    throw new ResourceNotFoundError("Course not found");
  }

  if (
    context.userRole === Role.TEACHER &&
    course.teacherId !== context.userId
  ) {
    throw new ForbiddenError("Not authorized to view this course");
  }

  if (context.userRole !== Role.ADMIN && context.userRole !== Role.TEACHER) {
    throw new ForbiddenError(
      "Only admins and teachers can view course students",
    );
  }

  const profiles = await prisma.studentProfile.findMany({
    where: {
      tenantId: context.tenantId,
      classId: course.classId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return profiles.map((p) => ({
    id: p.user.id,
    name: p.user.name,
    email: p.user.email,
    status: "Active",
  }));
}
