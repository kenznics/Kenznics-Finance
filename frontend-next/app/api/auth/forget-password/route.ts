import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend'

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email wajib diisi!' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: 'Jika email terdafatar, tautan reset akan dikirim.' });
        }

        // Buat token acak yang aman sepanjang 32 karakter (Hex) menggunakan Crypto bawaan Node.js
        const crypto = await import('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Set waktu kedaluwarsa token(Waktu sekarang + 15 menit)
        const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpires },
        });

        // 1. Ambil API Key dari file .env secara aman
        const resend = new Resend(process.env.RESEND_API_KEY);

        // 2. Rakit tautan lengkap menggunakan token acak yang sudah dibuat di atas
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        // 3. Kirim email asli menggunakan variabel tautan yang benar
        await resend.emails.send({
            from: 'Kenznics Finance <noreply@resend.dev>',
            to: email,
            subject: 'Atur Ulang Kata Sandi Anda',
            html: `<p>Halo,</p><p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Kenznics Finance Anda.</p><p>Silakan klik tautan di bawah ini untuk melanjutkan:</p><a href="${resetLink}" style="display:inline-block;background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;font-weight:bold;">Atur Ulang Kata Sandi</a><p>Tautan ini hanya berlaku selama 15 menit.</p>`
        });

        return NextResponse.json({ message: 'Jika email terdaftar, tautan reset akan dikirim' })

    } catch (error) {
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}