import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const POST = authorizedRoute(async ({ req, tenantId }) => {
  const body = await req.json();
  const { email, role } = body;

  if (!email || !role) {
    return NextResponse.json({ error: "Email and Role are required" }, { status: 400 });
  }

  // Validate Role Enum used strictly (Admin/Teacher/Student/Parent)
  // TypeScript check:
  if (!Object.values(UserRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Check if user exists in THIS tenant
  const existing = await prisma.domainUser.findFirst({
    where: {
      email,
      tenantId
    }
  });

  if (existing) {
    return NextResponse.json({ error: "User already exists in this tenant" }, { status: 409 });
  }

  // Create User (Domain Level)
  // Note: This does NOT create a Better Auth user (password/login) yet.
  // Typically, an invite flow sends an email with a link to sign up/set password.
  // The instructions say "Invite must create a User record scoped to the same tenant".
  // Better Auth will link to this via email matching or explicit link later (as handled in auth.ts).

  const newUser = await prisma.domainUser.create({
    data: {
      name: "", // Placeholder until signup
      email,
      role: role as UserRole,
      tenantId
    }
  });

  return NextResponse.json({ success: true, userId: newUser.id }, { status: 201 });
}, {
  roles: [UserRole.ADMIN]
});
