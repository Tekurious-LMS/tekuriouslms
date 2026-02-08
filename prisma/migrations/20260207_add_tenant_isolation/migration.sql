-- CreateTable: Tenant (Organization)
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "themeConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- Step 1: Add tenantId columns as nullable first (to allow data backfill)
ALTER TABLE "User" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Board" ADD COLUMN "tenantId" UUID;
ALTER TABLE "School" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Class" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Subject" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Course" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Enrollment" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Assessment" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Attempt" ADD COLUMN "tenantId" UUID;
ALTER TABLE "StudentAnalytics" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Ranking" ADD COLUMN "tenantId" UUID;
ALTER TABLE "Subscription" ADD COLUMN "tenantId" UUID;

-- Step 2: Create a default tenant for existing data
INSERT INTO "Tenant" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Default Organization',
    'default',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Step 3: Backfill tenantId for all existing records with the default tenant
UPDATE "User" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Board" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "School" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Class" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Subject" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Course" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Enrollment" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Assessment" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Attempt" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "StudentAnalytics" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Ranking" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;
UPDATE "Subscription" SET "tenantId" = (SELECT "id" FROM "Tenant" WHERE "slug" = 'default') WHERE "tenantId" IS NULL;

-- Step 4: Make tenantId NOT NULL
ALTER TABLE "User" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Board" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "School" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Class" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Subject" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Course" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Enrollment" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Assessment" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Attempt" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "StudentAnalytics" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Ranking" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN "tenantId" SET NOT NULL;

-- Step 5: Add foreign key constraints
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Board" ADD CONSTRAINT "Board_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "School" ADD CONSTRAINT "School_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Class" ADD CONSTRAINT "Class_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Course" ADD CONSTRAINT "Course_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAnalytics" ADD CONSTRAINT "StudentAnalytics_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 6: Create composite indexes for tenant-scoped queries
CREATE INDEX "User_tenantId_id_idx" ON "User"("tenantId", "id");
CREATE INDEX "User_tenantId_email_idx" ON "User"("tenantId", "email");
CREATE INDEX "Board_tenantId_id_idx" ON "Board"("tenantId", "id");
CREATE INDEX "School_tenantId_id_idx" ON "School"("tenantId", "id");
CREATE INDEX "Class_tenantId_id_idx" ON "Class"("tenantId", "id");
CREATE INDEX "Subject_tenantId_id_idx" ON "Subject"("tenantId", "id");
CREATE INDEX "Course_tenantId_id_idx" ON "Course"("tenantId", "id");
CREATE INDEX "Enrollment_tenantId_id_idx" ON "Enrollment"("tenantId", "id");
CREATE INDEX "Enrollment_tenantId_userId_idx" ON "Enrollment"("tenantId", "userId");
CREATE INDEX "Assessment_tenantId_id_idx" ON "Assessment"("tenantId", "id");
CREATE INDEX "Attempt_tenantId_id_idx" ON "Attempt"("tenantId", "id");
CREATE INDEX "Attempt_tenantId_userId_idx" ON "Attempt"("tenantId", "userId");
CREATE INDEX "StudentAnalytics_tenantId_id_idx" ON "StudentAnalytics"("tenantId", "id");
CREATE INDEX "Ranking_tenantId_id_idx" ON "Ranking"("tenantId", "id");
CREATE INDEX "Ranking_tenantId_scope_idx" ON "Ranking"("tenantId", "scope");
CREATE INDEX "Subscription_tenantId_id_idx" ON "Subscription"("tenantId", "id");
