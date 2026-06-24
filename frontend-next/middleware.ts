import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    // Mengambil cookie
    const token = request.cookies.get('authToken')?.value;
    
    // Jika tepat pengguna masuk ke dashboad
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/history'],
};