import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  void _request;
  try {
    // Test Prisma connection
    const userCount = await prisma.lmsUser.count();

    return NextResponse.json({
      success: true,
      message: "Prisma connection works",
      userCount,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          stack: error.stack,
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
      },
      { status: 500 },
    );
  }
}
