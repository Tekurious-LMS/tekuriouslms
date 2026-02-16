-- Phase 1 SOP Schema Updates
-- Creates: Notice, Notification, ScheduledClass, ClassSession, Attendance, UsageLog
-- Updates: Assessment (totalMarks), Submission (attemptNumber, remove unique), Chapter/Topic (tenantId), etc.

-- CreateEnum for new enums
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "NoticeCategory" AS ENUM ('GENERAL', 'URGENT', 'ACADEMIC', 'ADMINISTRATIVE');
CREATE TYPE "ScheduledClassStatus" AS ENUM ('SCHEDULED', 'RUNNING', 'COMPLETED', 'CANCELLED');
CREATE TYPE "UsageLogType" AS ENUM ('LOGIN', 'CONTENT_ACCESS', 'ASSESSMENT_ATTEMPT', 'TIME_SPENT');

-- AlterTable: Assessment - add totalMarks
ALTER TABLE "Assessment" ADD COLUMN IF NOT EXISTS "totalMarks" INTEGER NOT NULL DEFAULT 100;

-- AlterTable: Submission - add attemptNumber, remove unique constraint
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "attemptNumber" INTEGER NOT NULL DEFAULT 1;
DROP INDEX IF EXISTS "Submission_assessmentId_studentId_tenantId_key";
CREATE INDEX IF NOT EXISTS "Submission_assessmentId_studentId_attemptNumber_idx" ON "Submission"("assessmentId", "studentId", "attemptNumber");

-- AlterTable: Enrollment - migrate status from TEXT to EnrollmentStatus enum
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "statusNew" "EnrollmentStatus" DEFAULT 'ACTIVE';
UPDATE "Enrollment" SET "statusNew" = 'INACTIVE'::"EnrollmentStatus" WHERE UPPER(COALESCE("status", '')) = 'INACTIVE';
UPDATE "Enrollment" SET "statusNew" = 'ACTIVE'::"EnrollmentStatus" WHERE "statusNew" IS NULL;
ALTER TABLE "Enrollment" DROP COLUMN IF EXISTS "status";
ALTER TABLE "Enrollment" RENAME COLUMN "statusNew" TO "status";
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
ALTER TABLE "Enrollment" ALTER COLUMN "progress" SET DEFAULT 0;

-- AlterTable: StudentProfile - add academicHistory, engagementScore
ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "academicHistory" JSONB;
ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "engagementScore" DOUBLE PRECISION;

-- AlterTable: Payment - add tenantId, paidAt
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "tenantId" UUID;
UPDATE "Payment" SET "tenantId" = (SELECT "tenantId" FROM "Subscription" WHERE "Subscription"."id" = "Payment"."subscriptionId") WHERE "tenantId" IS NULL;
UPDATE "Payment" SET "tenantId" = (SELECT "id" FROM "Tenant" LIMIT 1) WHERE "tenantId" IS NULL;
ALTER TABLE "Payment" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "Payment_tenantId_idx" ON "Payment"("tenantId");

-- AlterTable: Chapter - add tenantId, orderIndex, timestamps
ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "orderIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "tenantId" UUID;
ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "Chapter" SET "tenantId" = (SELECT "tenantId" FROM "Subject" WHERE "Subject"."id" = "Chapter"."subjectId") WHERE "tenantId" IS NULL;
ALTER TABLE "Chapter" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "Chapter_tenantId_subjectId_idx" ON "Chapter"("tenantId", "subjectId");

-- AlterTable: Topic - add tenantId, orderIndex, timestamps
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "orderIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "tenantId" UUID;
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "Topic" SET "tenantId" = (SELECT "tenantId" FROM "Chapter" WHERE "Chapter"."id" = "Topic"."chapterId") WHERE "tenantId" IS NULL;
ALTER TABLE "Topic" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "Topic_tenantId_chapterId_idx" ON "Topic"("tenantId", "chapterId");

-- CreateTable: Notice
CREATE TABLE IF NOT EXISTS "Notice" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "NoticeCategory" NOT NULL DEFAULT 'GENERAL',
    "targetRoles" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "tenantId" UUID NOT NULL,
    "createdBy" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Notice_tenantId_publishedAt_idx" ON "Notice"("tenantId", "publishedAt");
CREATE INDEX IF NOT EXISTS "Notice_tenantId_category_idx" ON "Notice"("tenantId", "category");
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: NoticeReadReceipt
CREATE TABLE IF NOT EXISTS "NoticeReadReceipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "noticeId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "NoticeReadReceipt_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "NoticeReadReceipt_noticeId_userId_key" ON "NoticeReadReceipt"("noticeId", "userId");
CREATE INDEX IF NOT EXISTS "NoticeReadReceipt_tenantId_idx" ON "NoticeReadReceipt"("tenantId");
ALTER TABLE "NoticeReadReceipt" ADD CONSTRAINT "NoticeReadReceipt_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'system',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Notification_tenantId_userId_idx" ON "Notification"("tenantId", "userId");
CREATE INDEX IF NOT EXISTS "Notification_tenantId_read_idx" ON "Notification"("tenantId", "read");
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: ScheduledClass
CREATE TABLE IF NOT EXISTS "ScheduledClass" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "courseId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "ScheduledClassStatus" NOT NULL DEFAULT 'SCHEDULED',
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledClass_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ScheduledClass_tenantId_scheduledAt_idx" ON "ScheduledClass"("tenantId", "scheduledAt");
CREATE INDEX IF NOT EXISTS "ScheduledClass_tenantId_status_idx" ON "ScheduledClass"("tenantId", "status");
ALTER TABLE "ScheduledClass" ADD CONSTRAINT "ScheduledClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ScheduledClass" ADD CONSTRAINT "ScheduledClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ScheduledClass" ADD CONSTRAINT "ScheduledClass_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: ClassSession
CREATE TABLE IF NOT EXISTS "ClassSession" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scheduledClassId" UUID NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "tenantId" UUID NOT NULL,

    CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ClassSession_tenantId_idx" ON "ClassSession"("tenantId");
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_scheduledClassId_fkey" FOREIGN KEY ("scheduledClassId") REFERENCES "ScheduledClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: Attendance
CREATE TABLE IF NOT EXISTS "Attendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "classSessionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" UUID NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Attendance_classSessionId_userId_key" ON "Attendance"("classSessionId", "userId");
CREATE INDEX IF NOT EXISTS "Attendance_tenantId_idx" ON "Attendance"("tenantId");
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: UsageLog
CREATE TABLE IF NOT EXISTS "UsageLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" "UsageLogType" NOT NULL,
    "resourceId" UUID,
    "metadata" JSONB,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "UsageLog_tenantId_userId_idx" ON "UsageLog"("tenantId", "userId");
CREATE INDEX IF NOT EXISTS "UsageLog_tenantId_type_idx" ON "UsageLog"("tenantId", "type");
CREATE INDEX IF NOT EXISTS "UsageLog_tenantId_createdAt_idx" ON "UsageLog"("tenantId", "createdAt");
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
