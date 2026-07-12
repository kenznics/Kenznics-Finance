import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

    const pathname  = request.nextUrl.pathname;

    // Mengambil cookie
    const token = request.cookies.get('authToken')?.value;
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/history') || pathname.startsWith('/input');

    // Jika tepat pengguna masuk ke dashboad, menendang ke login
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
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
    ],
};