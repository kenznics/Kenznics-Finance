import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface MyJWTPayLoad {
    userId?: number;
    id?: number;
}

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Askses ditolak, silahkan login kembali!" }, { status: 401 })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("Token JWT tidak ditemukan di environment variables!");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as MyJWTPayLoad;
        const loggedInUserId = decoded.userId || decoded.id;

        if (!loggedInUserId) {
            return NextResponse.json({ error: 'Token tidak valid!' }, { status: 401 });
        }

        const body = await request.json();
        const { name, oldPassword, newPassword } = body;

        // Ambil data user saat ini dari DB
        const user = await prisma.user.findUnique({
            where: { id: loggedInUserId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
        }

        // Objek update
        const updateData: { name?: string; password?: string } = {};

        // Jika ada perubahan bagian nama
        if (name !== undefined) {
            updateData.name = name.trim()
        }

        // User ingin menganti password
        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return NextResponse.json({ error: "Kata sandi lama yang Anda masukkin salah!" }, { status: 400 })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword
        }

        // Eksekusi update ke DB
        const updateUser = await prisma.user.update({
            where: { id: loggedInUserId },
            data: updateData,
            select: { id: true, name: true, email: true }
        });

        return NextResponse.json({
            message: 'Profile berhasil diperbarui!',
            user: updateUser
        }, { status: 200 });

    } catch (error) {
        console.error("Gagal memperbarui profile:", error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan pada server internal' },
            { status: 500 }
        );
    }
}