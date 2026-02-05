import { NextResponse } from "next/server";
import { authorizedRoute } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const POST = authorizedRoute(async ({ req, tenantId }) => {
  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Check Duplicate
  const existing = await prisma.subject.findFirst({
    where: {
      tenantId,
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  });

  if (existing) {
    return NextResponse.json({ error: "Subject with this name already exists" }, { status: 409 });
  }

  const newSubject = await prisma.subject.create({
    data: {
      name,
      description,
      tenantId
    }
  });

  return NextResponse.json(newSubject, { status: 201 });
}, {
  roles: [UserRole.ADMIN]
});
