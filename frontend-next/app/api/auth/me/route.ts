import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'KenzNik500.') as { userId: number };
        
        const dbUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { email: true },
        });

        if (!dbUser) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                email: dbUser.email,
            }
        });

    } catch  {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}