import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email dan password wajib diisi!' }, { status: 400 });
        }

        // Check apakah email sudah terdaftar di DB 
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email telah digunakan!' }, { status: 400 });
        }

        // Enkripsi password menggunakan bcryptjs
        // Angka 10 ada SaltRounds standard enkripsi
        const hashedPassword = await bcrypt.hash(password, 10);

        // Menyimpan user baru ke database Cloud Neon Via Prisma
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        return NextResponse.json({
            message: 'Registrasi berhasil!',
            user: {
                id: newUser.id,
                email: newUser.email
            }
        }, { status: 201 })

    } catch (error) {
    }
}