-- Migrate from better-auth to Supabase Auth
-- 1. Drop FK from User to user table
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_betterAuthUserId_fkey";

-- 2. Drop better-auth tables (order matters due to FKs)
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "verification";

-- 3. Rename column betterAuthUserId to authUserId
ALTER TABLE "User" RENAME COLUMN "betterAuthUserId" TO "authUserId";
