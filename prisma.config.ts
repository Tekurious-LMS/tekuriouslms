import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Supabase: DIRECT_URL for migrations (Session pooler 5432 or direct connection).
    // Falls back to DATABASE_URL if DIRECT_URL not set.
    url: process.env.DIRECT_URL || env("DATABASE_URL"),
  },
});
