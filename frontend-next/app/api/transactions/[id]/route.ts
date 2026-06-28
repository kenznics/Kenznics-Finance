import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface MyJWTPayLoad {
    userId?: number;
    id?: number;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const transactionId = parseInt(id);

        if (isNaN(transactionId)) {
            return NextResponse.json({ error: 'ID transaksi tidak valid' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Akses ditolak, token tidak ditemukan' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'KenzNik500.') as MyJWTPayLoad;
        const loggedInUserId = decoded.userId || decoded.id;

        if (!loggedInUserId) {
            return NextResponse.json({ error: 'Pengguna tidak valid atau tidak dikenali' }, { status: 401 });
        }

        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        });

        if (!existingTransaction) {
            return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
        }

        if (existingTransaction.userId !== loggedInUserId) {
            return NextResponse.json({ error: 'Anda tidak memiliki hak akses untuk menghapus transaksi ini' }, { status: 403 });
        }

        await prisma.transaction.delete({
            where: { id: transactionId }
        });

        revalidatePath('/dashboard');
        revalidatePath('/history');
        revalidatePath('/input');

        return NextResponse.json({ message: 'Transaksi berhasil dihapus' }, { status: 200 });

    } catch (error) {
        console.error("Gagal mengapus data di Route handle", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahn diserver internal saat menghapus data' },
            { status: 500 }
        );
    }
};
