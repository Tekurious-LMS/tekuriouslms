import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { auditLogService } from "@/lib/audit-log.service";

export const POST = authorizedRoute(async ({ tenantId, user, req, params }) => {
  const { id } = await params;

  // 1. Parse Body
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { answers } = body;

  if (!answers) {
    return NextResponse.json({ error: "Answers are required" }, { status: 400 });
  }

  // 2. Fetch Assessment & verify Enrollment
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: id as string,
      tenantId
    },
    include: {
      course: true
    }
  });

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  // 3. Verify Student Enrollment
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    select: { classId: true }
  });

  if (!studentProfile?.classId || studentProfile.classId !== assessment.course.classId) {
    return NextResponse.json({ error: "Forbidden: Not enrolled in this course's class" }, { status: 403 });
  }

  // 4. Check for existing submission
  const existingSubmission = await prisma.submission.findUnique({
    where: {
      studentId_assessmentId: {
        studentId: user.id,
        assessmentId: assessment.id
      }
    }
  });

  if (existingSubmission) {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  }

  // 5. Create Submission
  const submission = await prisma.submission.create({
    data: {
      tenantId,
      studentId: user.id,
      assessmentId: assessment.id,
      status: "Completed",
      submittedAt: new Date(),
      answers: answers
    }
  });

  // Audit Log
  await auditLogService.log({
    tenantId,
    actorId: user.id,
    actorRole: user.role,
    actionType: "SUBMIT_ASSESSMENT",
    resourceType: "Submission",
    resourceId: submission.id,
    metadata: { assessmentId: assessment.id, score: submission.score },
    ipAddress: auditLogService.getIpAddress(req.headers),
    userAgent: auditLogService.getUserAgent(req.headers),
  });

  return NextResponse.json({
    success: true,
    submissionId: submission.id
  });

}, {
  roles: [UserRole.STUDENT] // Only Students can submit
});
