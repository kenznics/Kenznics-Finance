import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        // 1. Mengambil data dari request body ke form login
        const body = await request.json();
        const { email, password, rememberMe } = body;

        // Validasi input kosong
        if (!email || !password) {
            return NextResponse.json({ error: 'Email dan password wajib diisi!' }, { status: 400 });
        }

        // 2. Mencari user di DB berdsarkan email menggunakan Prisma ORM
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // Jika user tidak ditemukan
        if (!user) {
            return NextResponse.json({ message: 'Email atau password salah!' }, { status: 401 });
        }

        // 3. Membandingkan password input dengan password terkenkripsi di datavbase dengan bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Email atau password salah!' }, { status: 401 });
        }

        // 4. Token JWT
        const secretKey = process.env.JWT_SECRET || 'KenzNik500.';
        const token = jwt.sign(
            { userId: user.id },
            secretKey,
            { expiresIn: rememberMe ? '7d' : '1d' } // Umur token di dalam JWT
        );

        // Konfigurasi kuki Dinamis ("remember me")
        const cookieStore = await cookies();

        // Opsi dasar kuki kemana (HttpOnly & secure)
        const cookieOptions = {
            httpOnly: true, // Mencegah kuki dibaca skript lewat JS XSS Protection
            secure: process.env.NODE_ENV === 'production', // Kuki dikirim lewat https jika sudah di publish
            path: '/', // Berlaku di seluruh halaman 
            maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined,
        };

        if (rememberMe) {
            cookieOptions.maxAge = 60 * 60 * 24 * 7;
        }

        cookieStore.set('authToken', token, cookieOptions);

        return NextResponse.json({
            message: 'Login sukses!',
            user: { id: user.id, email: user.email }
        }, { status: 200 });

    } catch (error) {
        console.error("Gagal memproses login Route Handle", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan server internal' },
            { status: 500 }
        );
    }
}