/**
 * Progress Repository
 *
 * Deterministic progress tracking with monotonic status progression
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError, ResourceNotFoundError } from "./rbac-errors";
import { Progress } from "@prisma/client";

enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

const STATUS_ORDER = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

/**
 * Update lesson progress (student only)
 */
export async function updateLessonProgress(
  context: RBACContext,
  lessonId: string,
  status: ProgressStatus,
): Promise<Progress> {
  if (context.userRole !== Role.STUDENT) {
    throw new ForbiddenError("Only students can update progress");
  }

  // Validate enrollment
  const isEnrolled = await validateEnrollmentForProgress(
    context.userId,
    lessonId,
    context.tenantId,
  );

  if (!isEnrolled) {
    throw new ForbiddenError("You are not enrolled in this course");
  }

  // Get lesson with course info
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!lesson) {
    throw new ResourceNotFoundError("Lesson not found");
  }

  // Get existing progress
  const existingProgress = await prisma.progress.findFirst({
    where: {
      studentId: context.userId,
      lessonId,
      tenantId: context.tenantId,
    },
  });

  // Enforce monotonic progression
  enforceMonotonicProgression(
    existingProgress?.status as ProgressStatus | null,
    status,
  );

  // Upsert progress
  const progress = await prisma.progress.upsert({
    where: {
      studentId_lessonId_tenantId: {
        studentId: context.userId,
        lessonId,
        tenantId: context.tenantId,
      },
    },
    update: {
      status,
      lastAccessedAt: new Date(),
    },
    create: {
      studentId: context.userId,
      lessonId,
      courseId: lesson.courseId,
      status,
      tenantId: context.tenantId,
    },
  });

  return progress;
}

/**
 * Get student progress summary
 */
export async function getStudentProgress(
  context: RBACContext,
  studentId: string,
): Promise<{
  studentId: string;
  studentName: string;
  courses: {
    courseId: string;
    courseName: string;
    totalLessons: number;
    completedLessons: number;
  }[];
  assessments: {
    assessmentId: string;
    assessmentTitle: string;
    courseName: string;
    completed: boolean;
    score: number;
    totalQuestions: number;
    submittedAt: Date;
  }[];
}> {
  // STUDENT: Only self
  if (context.userRole === Role.STUDENT && context.userId !== studentId) {
    throw new ForbiddenError("You can only view your own progress");
  }

  // PARENT: Only linked students
  if (context.userRole === Role.PARENT) {
    const isLinked = await prisma.parentMapping.findFirst({
      where: {
        parentUserId: context.userId,
        studentUserId: studentId,
        tenantId: context.tenantId,
      },
    });

    if (!isLinked) {
      throw new ForbiddenError("You can only view linked students' progress");
    }
  }

  // ADMIN: Can view any student

  // Get student profile
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: studentId,
      tenantId: context.tenantId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!studentProfile) {
    throw new ResourceNotFoundError("Student profile not found");
  }

  // Get enrolled courses
  const courses = await prisma.course.findMany({
    where: {
      classId: studentProfile.classId,
      tenantId: context.tenantId,
    },
    include: {
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  // Get progress for each course
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progressRecords = await prisma.progress.findMany({
        where: {
          studentId,
          courseId: course.id,
          tenantId: context.tenantId,
        },
      });

      const completedLessons = progressRecords.filter(
        (p) => p.status === "COMPLETED",
      ).length;
      const inProgressLessons = progressRecords.filter(
        (p) => p.status === "IN_PROGRESS",
      ).length;

      const completionPercentage =
        course._count.lessons > 0
          ? Math.round((completedLessons / course._count.lessons) * 100)
          : 0;

      return {
        courseId: course.id,
        courseName: course.title,
        totalLessons: course._count.lessons,
        completedLessons,
        inProgressLessons,
        completionPercentage,
      };
    }),
  );

  // Get assessment submissions
  const submissions = await prisma.submission.findMany({
    where: {
      studentId,
      tenantId: context.tenantId,
    },
    include: {
      assessment: {
        select: {
          id: true,
          title: true,
          course: {
            select: {
              title: true,
            },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
  });

  const assessments = submissions.map((s) => ({
    assessmentId: s.assessment.id,
    assessmentTitle: s.assessment.title,
    courseName: s.assessment.course.title,
    completed: s.status === "COMPLETED",
    score: s.score,
    totalQuestions: s.assessment._count.questions,
    submittedAt: s.submittedAt,
  }));

  return {
    studentId,
    studentName: studentProfile.user.name,
    courses: coursesWithProgress,
    assessments,
  };
}

/**
 * Get teacher class analytics (aggregated)
 */
export async function getTeacherAnalytics(context: RBACContext): Promise<{
  courses: {
    courseId: string;
    courseName: string;
    enrollmentCount: number;
    averageCompletionRate: number;
    totalLessons: number;
    assessmentCount: number;
    assessmentParticipation: number;
  }[];
}> {
  if (context.userRole !== Role.TEACHER) {
    throw new ForbiddenError("Only teachers can view class analytics");
  }

  // Get teacher's courses
  const courses = await prisma.course.findMany({
    where: {
      teacherId: context.userId,
      tenantId: context.tenantId,
    },
    include: {
      class: {
        include: {
          studentProfiles: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          assessments: true,
        },
      },
    },
  });

  const coursesWithAnalytics = await Promise.all(
    courses.map(async (course) => {
      const enrollmentCount = course.class.studentProfiles.length;

      // Get all progress records for this course
      const progressRecords = await prisma.progress.findMany({
        where: {
          courseId: course.id,
          tenantId: context.tenantId,
        },
      });

      const completedCount = progressRecords.filter(
        (p) => p.status === "COMPLETED",
      ).length;
      const totalPossible = enrollmentCount * course._count.lessons;
      const averageCompletionRate =
        totalPossible > 0
          ? Math.round((completedCount / totalPossible) * 100)
          : 0;

      // Get assessment participation
      const assessmentSubmissions = await prisma.submission.count({
        where: {
          assessment: {
            courseId: course.id,
          },
          tenantId: context.tenantId,
        },
      });

      const totalPossibleSubmissions =
        enrollmentCount * course._count.assessments;
      const assessmentParticipation =
        totalPossibleSubmissions > 0
          ? Math.round((assessmentSubmissions / totalPossibleSubmissions) * 100)
          : 0;

      return {
        courseId: course.id,
        courseName: course.title,
        enrollmentCount,
        averageCompletionRate,
        totalLessons: course._count.lessons,
        assessmentCount: course._count.assessments,
        assessmentParticipation,
      };
    }),
  );

  return {
    courses: coursesWithAnalytics,
  };
}

/**
 * Get admin adoption metrics (aggregated)
 */
export async function getAdminAnalytics(context: RBACContext): Promise<{
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalAssessments: number;
  averageCourseCompletion: number;
  averageAssessmentCompletion: number;
}> {
  if (context.userRole !== Role.ADMIN) {
    throw new ForbiddenError("Only admins can view adoption metrics");
  }

  // Total students
  const totalStudents = await prisma.studentProfile.count({
    where: {
      tenantId: context.tenantId,
    },
  });

  // Active students (with at least one progress record)
  const activeStudents = await prisma.progress.findMany({
    where: {
      tenantId: context.tenantId,
    },
    distinct: ["studentId"],
  });

  // Total courses
  const totalCourses = await prisma.course.count({
    where: {
      tenantId: context.tenantId,
    },
  });

  // Total assessments
  const totalAssessments = await prisma.assessment.count({
    where: {
      tenantId: context.tenantId,
    },
  });

  // Average course completion
  const allProgress = await prisma.progress.findMany({
    where: {
      tenantId: context.tenantId,
    },
  });

  const allCourses = await prisma.course.findMany({
    where: {
      tenantId: context.tenantId,
    },
    include: {
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  const totalLessons = allCourses.reduce((sum, c) => sum + c._count.lessons, 0);
  const completedLessons = allProgress.filter(
    (p) => p.status === "COMPLETED",
  ).length;
  const averageCourseCompletion =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Average assessment completion
  const totalSubmissions = await prisma.submission.count({
    where: {
      tenantId: context.tenantId,
      status: "COMPLETED",
    },
  });

  const averageAssessmentCompletion =
    totalAssessments > 0
      ? Math.round((totalSubmissions / totalAssessments) * 100)
      : 0;

  return {
    totalStudents,
    activeStudents: activeStudents.length,
    totalCourses,
    totalAssessments,
    averageCourseCompletion,
    averageAssessmentCompletion,
  };
}

/**
 * Validate student enrollment for progress update
 */
async function validateEnrollmentForProgress(
  userId: string,
  lessonId: string,
  tenantId: string,
): Promise<boolean> {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId, tenantId },
  });

  if (!studentProfile) {
    return false;
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, tenantId },
    include: {
      course: {
        select: {
          classId: true,
        },
      },
    },
  });

  if (!lesson) {
    return false;
  }

  // Enrollment = classId match
  return studentProfile.classId === lesson.course.classId;
}

/**
 * Enforce monotonic progression
 */
function enforceMonotonicProgression(
  currentStatus: ProgressStatus | null,
  newStatus: ProgressStatus,
): void {
  if (!currentStatus) {
    // First update, allow any status
    return;
  }

  const currentOrder = STATUS_ORDER[currentStatus];
  const newOrder = STATUS_ORDER[newStatus];

  if (newOrder < currentOrder) {
    throw new Error("Progress cannot regress");
  }

  // Same status is allowed (idempotent)
}
