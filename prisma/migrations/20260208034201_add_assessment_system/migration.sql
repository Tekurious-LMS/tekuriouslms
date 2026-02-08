/*
  Warnings:

  - You are about to drop the column `totalMarks` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the `Attempt` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('MCQ');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_userId_fkey";

-- DropIndex
DROP INDEX "Assessment_tenantId_id_idx";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "totalMarks",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "type" "AssessmentType" NOT NULL DEFAULT 'MCQ',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Attempt";

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssessmentQuestion_tenantId_assessmentId_idx" ON "AssessmentQuestion"("tenantId", "assessmentId");

-- CreateIndex
CREATE INDEX "Submission_tenantId_assessmentId_idx" ON "Submission"("tenantId", "assessmentId");

-- CreateIndex
CREATE INDEX "Submission_tenantId_studentId_idx" ON "Submission"("tenantId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assessmentId_studentId_tenantId_key" ON "Submission"("assessmentId", "studentId", "tenantId");

-- CreateIndex
CREATE INDEX "Assessment_tenantId_courseId_idx" ON "Assessment"("tenantId", "courseId");

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
