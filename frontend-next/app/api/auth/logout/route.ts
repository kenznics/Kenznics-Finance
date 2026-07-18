import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("authToken");

        return NextResponse.json({ succes: true, message: "Logout berhasil" });

    } catch {
        return NextResponse.json(
            { succes: false, message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}