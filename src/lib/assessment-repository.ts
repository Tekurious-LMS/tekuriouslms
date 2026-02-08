/**
 * Assessment Repository
 * 
 * MCQ assessment management with auto-grading and one-attempt policy
 */

import { prisma } from "./prisma";
import { RBACContext } from "./rbac-guard";
import { Role } from "./rbac-types";
import { ForbiddenError, ResourceNotFoundError } from "./rbac-errors";

/**
 * Get assessments (role-filtered)
 */
export async function getAssessments(context: RBACContext): Promise<any[]> {
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

        return assessments.map((a) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            dueDate: a.dueDate,
            courseId: a.courseId,
            courseName: a.course.title,
            createdAt: a.createdAt,
            totalQuestions: a._count.questions,
            hasSubmitted: a.submissions.length > 0,
            submission: a.submissions[0] || null,
        }));
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
            .map((m) => m.student.studentProfile?.classId)
            .filter((id): id is string => !!id);

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

        return assessments;
    }

    return [];
}

/**
 * Get assessment for attempt (no correct answers)
 */
export async function getAssessmentForAttempt(
    context: RBACContext,
    assessmentId: string
): Promise<any> {
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
            context.tenantId
        );

        if (!isEnrolled) {
            throw new ResourceNotFoundError("Assessment not found");
        }

        const hasSubmitted = await checkExistingSubmission(
            context.userId,
            assessmentId,
            context.tenantId
        );

        if (hasSubmitted) {
            throw new Error("You have already submitted this assessment");
        }
    }

    return {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
        dueDate: assessment.dueDate,
        course: assessment.course,
        questions: assessment.questions,
    };
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
    }
): Promise<any> {
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
        throw new ForbiddenError("You can only create assessments for your own courses");
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
    return await prisma.assessment.create({
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
}

/**
 * Submit assessment (student only, one attempt)
 */
export async function submitAssessment(
    context: RBACContext,
    assessmentId: string,
    answers: number[]
): Promise<any> {
    if (context.userRole !== Role.STUDENT) {
        throw new ForbiddenError("Only students can submit assessments");
    }

    // Check enrollment
    const isEnrolled = await isStudentEnrolled(
        context.userId,
        assessmentId,
        context.tenantId
    );

    if (!isEnrolled) {
        throw new ForbiddenError("You are not enrolled in this course");
    }

    // Check existing submission
    const hasSubmitted = await checkExistingSubmission(
        context.userId,
        assessmentId,
        context.tenantId
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
        id: submission.id,
        assessmentId: submission.assessmentId,
        score: submission.score,
        totalQuestions: assessment.questions.length,
        status: submission.status,
        submittedAt: submission.submittedAt,
    };
}

/**
 * Get submissions (teacher only)
 */
export async function getSubmissions(
    context: RBACContext,
    assessmentId: string
): Promise<any[]> {
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
        throw new ForbiddenError("You can only view submissions for your own courses");
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

    return submissions.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        studentName: s.student.name,
        studentEmail: s.student.email,
        score: s.score,
        totalQuestions: assessment._count.questions,
        status: s.status,
        submittedAt: s.submittedAt,
    }));
}

/**
 * Auto-grade MCQ submission
 */
function autoGradeSubmission(
    answers: number[],
    questions: Array<{ correctOptionIndex: number }>
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
    tenantId: string
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
    tenantId: string
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
