import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface MyJWTPayLoad {
    userId?: number;
    id?: number;
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Akses ditolak, token tidak ditemukan' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'KenzNik500.') as MyJWTPayLoad;
        const loggedInUserId = decoded.userId || decoded.id;

        const aggregation = await prisma.transaction.groupBy({
            by: ['type'],
            where: { userId: loggedInUserId },
            _sum: {
                amount: true
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;

        aggregation.forEach(item => {
            if (item.type === 'INCOME') totalIncome = item._sum.amount || 0;
            if (item.type === 'EXPENSE') totalExpense = item._sum.amount || 0;
        });

        const balance = totalIncome - totalExpense;

        return NextResponse.json({
            totalIncome,
            totalExpense,
            balance
        }, { status: 200 });

    } catch (error) {
        console.error("Gagal mengambil data di Route Handler", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan server internal' },
            { status: 500 }
        );
    }
}