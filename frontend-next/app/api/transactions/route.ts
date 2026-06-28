import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

        // Mengambil data transaski lewat DB dengan prisma ORM v7
        const transactions = await prisma.transaction.findMany({
            where: { userId: loggedInUserId },
            orderBy: { createAt: 'desc' }
        });

        return NextResponse.json(transactions, { status: 200 });

    } catch (error) {
        console.error("Gagal mengambil data di Route Handler", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan server internal' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Askses ditolak, token tidak ditemukan' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'KenzNik500.') as MyJWTPayLoad;
        const loggedInUserId = decoded.userId || decoded.id;

        if (!loggedInUserId) {
            return NextResponse.json({ error: 'Pengguna tidak valid atau tidak dikenali'}, { status: 401 });
        }

        const body = await request.json();
        const { title, amount, type } = body;

        const newTransaction = await prisma.transaction.create({
            data: {
                title: title,
                amount: parseFloat(amount),
                type: type,
                userId: loggedInUserId
            }
        });

        revalidatePath('/dasboard');
        revalidatePath('/history');
        revalidatePath('/input');

        return NextResponse.json(newTransaction, { status: 201 });

    } catch (error) {
        console.error("Gagal menambahkan data di Route Handler", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan server internal saat menyimpan data' },
            { status: 500 }
        );
    }
}

