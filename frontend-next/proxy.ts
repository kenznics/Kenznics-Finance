import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

    // Mengambil cookie
    const token = request.cookies.get('authToken')?.value;

    // Jika tepat pengguna masuk ke dashboad, menendang ke login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/history/:path*',
        '/input/:path*',
    ],
};