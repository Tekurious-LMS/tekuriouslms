import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Test Prisma connection
        const userCount = await prisma.user.count();

        return NextResponse.json({
            success: true,
            message: "Prisma connection works",
            userCount
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
