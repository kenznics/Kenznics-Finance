import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Mengambil cookie token
    const token = request.cookies.get('authToken')?.value;

    const isProtectedRoute =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/history') ||
        pathname.startsWith('/input');

    // Jika pengguna TIDAK memiliki token dan mencoba mengakses rute terproteksi, tendang ke login
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika pengguna SUDAH memiliki token dan mencoba mengakses auth-pages, arahkan ke dashboard
    if (token && (
        pathname === '/login' ||
        pathname === '/register' ||
        pathname.startsWith('/forget-password') ||
        pathname.startsWith('/reset-password')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/history/:path*',
        '/input/:path*',
        '/login',
        '/register',
        '/forget-password',
        '/reset-password', // WAJIB didaftarkan di sini agar dibaca oleh Next.js
    ],
};
