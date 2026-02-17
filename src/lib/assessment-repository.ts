/**
 * Assessment Repository
 *
 * MCQ assessment management with auto-grading and one-attempt enforcement
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError, ResourceNotFoundError } from "./rbac-errors";
import { logAudit, ActionType } from "./audit-logger";

/** Assessment model shape (aligned with Prisma schema) */
interface Assessment {
  id: string;
  title: string;
  type: "MCQ";
  totalMarks: number;
  dueDate: Date | null;
  courseId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Submission model shape (aligned with Prisma schema) */
interface Submission {
  id: string;
  attemptNumber: number;
  assessmentId: string;
  studentId: string;
  answers: unknown;
  score: number;
  status: string;
  submittedAt: Date;
  tenantId: string;
}

/** Submission plus total question count (e.g. from submitAssessment) */
export type SubmissionWithTotal = Submission & { totalQuestions: number };

/**
 * Get assessments (role-filtered)
 */
export async function getAssessments(
  context: RBACContext,
): Promise<Assessment[]> {
  // ADMIN: All assessments in tenant (metadata only)
  if (context.userRole === Role.ADMIN) {
    return await prisma.assessment.findMany({
      where: { tenantId: context.tenantId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // TEACHER: Assessments for own courses
  if (context.userRole === Role.TEACHER) {
    return await prisma.assessment.findMany({
      where: {
        course: {
          teacherId: context.userId,
          tenantId: context.tenantId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // STUDENT: Assessments for enrolled courses
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

    const assessments = await prisma.assessment.findMany({
      where: {
        course: {
          classId: studentProfile.classId,
          tenantId: context.tenantId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        submissions: {
          where: {
            studentId: context.userId,
          },
          select: {
            id: true,
            score: true,
            status: true,
            submittedAt: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return assessments.map(
      (a: (typeof assessments)[number]): Assessment => ({
        id: a.id,
        title: a.title,
        type: a.type,
        totalMarks: a.totalMarks ?? 100,
        dueDate: a.dueDate,
        courseId: a.courseId,
        tenantId: a.tenantId,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }),
    );
  }

  // PARENT: Assessments for linked student(s)
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
            submissions: {
              select: {
                id: true,
                assessmentId: true,
                score: true,
                status: true,
                submittedAt: true,
              },
            },
          },
        },
      },
    });

    const classIds = parentMappings
      .map(
        (m: (typeof parentMappings)[number]) =>
          m.student.studentProfile?.classId,
      )
      .filter((id: string | undefined): id is string => !!id);

    if (classIds.length === 0) {
      return [];
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        course: {
          classId: { in: classIds },
          tenantId: context.tenantId,
        },
      },
      select: {
        id: true,
        title: true,
        type: true,
        dueDate: true,
        courseId: true,
        course: {
          select: {
            title: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return assessments as unknown as Assessment[];
  }

  return [];
}

/**
 * Get assessment for attempt (no correct answers)
 */
export async function getAssessmentForAttempt(
  context: RBACContext,
  assessmentId: string,
): Promise<Assessment> {
  // Parent cannot access assessment for attempt
  if (context.userRole === Role.PARENT) {
    throw new ForbiddenError("Parents cannot attempt assessments");
  }

  // Admin cannot access assessment for attempt
  if (context.userRole === Role.ADMIN) {
    throw new ForbiddenError("Admins cannot attempt assessments");
  }

  const assessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      tenantId: context.tenantId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          teacherId: true,
          classId: true,
        },
      },
      questions: {
        select: {
          id: true,
          questionText: true,
          options: true,
          // NO correctOptionIndex
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!assessment) {
    throw new ResourceNotFoundError("Assessment not found");
  }

  // TEACHER: Only if owns course
  if (context.userRole === Role.TEACHER) {
    if (assessment.course.teacherId !== context.userId) {
      throw new ResourceNotFoundError("Assessment not found");
    }
  }

  // STUDENT: Only if enrolled and no existing submission
  if (context.userRole === Role.STUDENT) {
    const isEnrolled = await isStudentEnrolled(
      context.userId,
      assessmentId,
      context.tenantId,
    );

    if (!isEnrolled) {
      throw new ResourceNotFoundError("Assessment not found");
    }

    const hasSubmitted = await checkExistingSubmission(
      context.userId,
      assessmentId,
      context.tenantId,
    );

    if (hasSubmitted) {
      throw new Error("You have already submitted this assessment");
    }
  }

  return assessment as unknown as Assessment;
}

/**
 * Create assessment (teacher only)
 */
export async function createAssessment(
  context: RBACContext,
  data: {
    title: string;
    courseId: string;
    dueDate?: string;
    questions: Array<{
      questionText: string;
      options: string[];
      correctOptionIndex: number;
    }>;
  },
): Promise<Assessment> {
  if (context.userRole !== Role.TEACHER) {
    throw new ForbiddenError("Only teachers can create assessments");
  }

  // Validate teacher owns course
  const course = await prisma.course.findFirst({
    where: {
      id: data.courseId,
      teacherId: context.userId,
      tenantId: context.tenantId,
    },
  });

  if (!course) {
    throw new ForbiddenError(
      "You can only create assessments for your own courses",
    );
  }

  // Validate questions
  if (!data.questions || data.questions.length === 0) {
    throw new Error("Assessment must have at least one question");
  }

  for (const q of data.questions) {
    if (!q.questionText || q.options.length < 2) {
      throw new Error("Invalid question format");
    }

    if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
      throw new Error("Invalid correct option index");
    }
  }

  // Create assessment with questions
  const assessment = await prisma.assessment.create({
    data: {
      title: data.title,
      type: "MCQ",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      courseId: data.courseId,
      tenantId: context.tenantId,
      questions: {
        create: data.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          tenantId: context.tenantId,
        })),
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      questions: true,
    },
  });

  // Audit log
  await logAudit(context, {
    actionType: ActionType.ASSESSMENT_CREATED,
    resourceType: "Assessment",
    resourceId: assessment.id,
    metadata: {
      assessmentTitle: assessment.title,
      courseId: assessment.courseId,
      questionCount: data.questions.length,
    },
  });

  return assessment as unknown as Assessment;
}

/**
 * Submit assessment (student only, one attempt)
 */
export async function submitAssessment(
  context: RBACContext,
  assessmentId: string,
  answers: number[],
): Promise<SubmissionWithTotal> {
  if (context.userRole !== Role.STUDENT) {
    throw new ForbiddenError("Only students can submit assessments");
  }

  // Check enrollment
  const isEnrolled = await isStudentEnrolled(
    context.userId,
    assessmentId,
    context.tenantId,
  );

  if (!isEnrolled) {
    throw new ForbiddenError("You are not enrolled in this course");
  }

  // Check existing submission
  const hasSubmitted = await checkExistingSubmission(
    context.userId,
    assessmentId,
    context.tenantId,
  );

  if (hasSubmitted) {
    throw new Error("You have already submitted this assessment");
  }

  // Get assessment with questions
  const assessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      tenantId: context.tenantId,
    },
    include: {
      questions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!assessment) {
    throw new ResourceNotFoundError("Assessment not found");
  }

  // Validate answers
  if (answers.length !== assessment.questions.length) {
    throw new Error("Invalid number of answers");
  }

  // Auto-grade
  const score = autoGradeSubmission(answers, assessment.questions);

  // Create submission
  const submission = await prisma.submission.create({
    data: {
      assessmentId,
      studentId: context.userId,
      answers,
      score,
      status: "COMPLETED",
      tenantId: context.tenantId,
    },
  });

  return {
    ...submission,
    totalQuestions: assessment.questions.length,
  } as unknown as SubmissionWithTotal;
}

/**
 * Get submissions (teacher only)
 */
export async function getSubmissions(
  context: RBACContext,
  assessmentId: string,
): Promise<Submission[]> {
  if (context.userRole !== Role.TEACHER) {
    throw new ForbiddenError("Only teachers can view submissions");
  }

  // Validate teacher owns course
  const assessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      tenantId: context.tenantId,
    },
    include: {
      course: {
        select: {
          teacherId: true,
        },
      },
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!assessment) {
    throw new ResourceNotFoundError("Assessment not found");
  }

  if (assessment.course.teacherId !== context.userId) {
    throw new ForbiddenError(
      "You can only view submissions for your own courses",
    );
  }

  const submissions = await prisma.submission.findMany({
    where: {
      assessmentId,
      tenantId: context.tenantId,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return submissions.map(
    (s: (typeof submissions)[number]): SubmissionWithTotal =>
      ({
        id: s.id,
        assessmentId: s.assessmentId,
        studentId: s.studentId,
        answers: s.answers,
        score: s.score,
        totalQuestions: assessment._count.questions,
        status: s.status,
        submittedAt: s.submittedAt,
      }) as unknown as SubmissionWithTotal,
  );
}

/**
 * Auto-grade MCQ submission
 */
function autoGradeSubmission(
  answers: number[],
  questions: Array<{ correctOptionIndex: number }>,
): number {
  let score = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const studentAnswer = answers[i];

    if (studentAnswer === question.correctOptionIndex) {
      score++;
    }
  }

  return score;
}

/**
 * Check if student is enrolled (via classId match)
 */
async function isStudentEnrolled(
  userId: string,
  assessmentId: string,
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

  const assessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      tenantId,
    },
    include: {
      course: {
        select: {
          classId: true,
        },
      },
    },
  });

  if (!assessment) {
    return false;
  }

  return studentProfile.classId === assessment.course.classId;
}

/**
 * Check if student has existing submission
 */
async function checkExistingSubmission(
  userId: string,
  assessmentId: string,
  tenantId: string,
): Promise<boolean> {
  const submission = await prisma.submission.findFirst({
    where: {
      assessmentId,
      studentId: userId,
      tenantId,
    },
  });

  return !!submission;
}
