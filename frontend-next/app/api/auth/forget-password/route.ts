import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

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

        // 2. Rakit tautan lengkap menggunakan token acak yang sudah dibuat di atas
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 3. Kirim email asli menggunakan variabel tautan yang benar
        await transporter.sendMail({
            from: '"Kenznics Finance" <' + process.env.GMAIL_USER + '>',
            to: email,
            subject: 'Atur Ulang Kata Sandi Anda - Kenznics Finance',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #1e293b; text-align: center;">Kenznics Finance</h2>
                    <p style="color: #475569;">Halo,</p>
                    <p style="color: #475569;">Kami menerima permintaan untuk mengatur ulang kata sandi akun Kenznics Finance Anda.</p>
                    <p style="color: #475569;">Silakan klik tombol di bawah ini untuk melanjutkan:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Atur Ulang Kata Sandi</a>
                    </div>
                    <p style="color: #64748b; font-size: 12px;">Tautan ini hanya berlaku selama 15 menit. Jika Anda tidak merasa melakukan permintaan ini, abaikan saja email ini.</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Jika email terdaftar, tautan reset akan dikirim' })

    } catch (error) {
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}