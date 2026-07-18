import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;
        if (!token) return NextResponse.json({ error: "Akses ditolak!" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId?: number; id?: number };
        const loggedInUserId = decoded.userId || decoded.id;
        if (!loggedInUserId) return NextResponse.json({ error: 'Token tidak valid!' }, { status: 401 });

        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: "File tidak ditemukan!" }, { status: 400 });

        const blob = await put(`avatar/user-${loggedInUserId}-${Date.now()}-${file.name}`, file, {
            access: 'public',
        });

        const updatedUser = await prisma.user.update({
            where: { id: loggedInUserId },
            data: { image: blob.url },
            select: { id: true, name: true, email: true, image: true }
        });

        return NextResponse.json({ message: "Avatar berhasil diupload!", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error upload blob:", error);
        return NextResponse.json({ error: "Gagal mengupload gambar ke server!" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;
        if (!token) return NextResponse.json({ error: "Askses ditolak!" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId?: number; id?: number };
        const loggedInUserId = decoded.userId || decoded.id;
        if (!loggedInUserId) return NextResponse.json({ error: 'Token tidak valid!' }, { status: 401 });

        const updatedUser = await prisma.user.update({
            where: { id: loggedInUserId },
            data: { image: null },
            select: { id: true, name: true, email: true, image: true }
        });

        return NextResponse.json({ message: "Avatar berhasil dihapus!", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error delete avatar:", error);
        return NextResponse.json({ error: "Gagal menghapus foto profile!" }, { status: 500 });
    }
}