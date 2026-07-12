import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token dan kata sandi baru wajib diisi!" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
        }

        if (user.resetTokenExpires && new Date() > user.resetTokenExpires) {
            return NextResponse.json({ error: 'Token sudah kadarluwarsa' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return NextResponse.json({ message: 'Kata sandi berhasil diperbarui, silahkan login kembali' });
    } catch (error) {
        return NextResponse.json({ error: 'Terjadi kesalahn pada server' }, { status: 500 });
    }
}
