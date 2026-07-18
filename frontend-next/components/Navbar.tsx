"use client";

import { useAuth } from "@/app/context/useAuth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const hiddenRoutes = ['/login', '/', '/register', '/reset-password', '/forget-password'];
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    if (hiddenRoutes.includes(pathname)) {
        return null;
    }

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                logout();
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Gagal melakukkan logout", error);
        }
    };

    return (
        <>
            <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
                <div className="font-bold text-xl tracking-tight text-indigo-400">
                    Kenznics Finance
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <span className='md:hidden text-sm font-medium text-indigo-200 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600 shadow-sm'>
                            👋 Halo, <span className='font-bold text-white'>{user.name || user.email}</span>
                        </span>
                    )}

                    {/* --- 1. TOMBOL HAMBURGER (Hanya muncul di Layar HP) --- */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                    >
                        <svg className="h-6 w-6" fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            {isMenuOpen ? (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* --- 2. MENU UTAMA LAPTOP (Sekarang menggunakan hidden md:flex) --- */}
                <div className='hidden md:flex items-center gap-6 text-sm font-medium'>

                    {user && (
                        <span className='text-sm font-medium text-indigo-200 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600 shadow-sm'>
                            👋 Halo, <span className='font-bold text-white'>{user.name || user.email}</span>
                        </span>
                    )}

                    <Link href="/dashboard" className='py-2.5 hover:text-indigo-300 transition-colors'>
                        Dashboard
                    </Link>

                    <Link href="/input" className='py-2.5 hover:text-indigo-300 transition-colors'>
                        Input Transaksi
                    </Link>

                    <Link href="/history" className='py-2.5 hover:text-indigo-300 transition-colors'>
                        History
                    </Link>

                    <Link href="/settings" className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-full transition-all group">
                        <img
                            src={user?.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.name || user?.email || 'Kenznics')}`}
                            alt="Profile"
                            className="w-7 h-7 rounded-full object-cover border border-indigo-400/50 group-hover:scale-105 transition-transform"
                        />
                        <span className="text-xs font-bold text-indigo-200 group-hover:text-white max-w-[100px] truncate">
                            {user?.name || 'Profile'}
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-red-500 text-white-600 font-bold rounded-xl shadow hover:bg-emerald-400 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className='md:hidden bg-slate-800 border-t border-slate-700 px-6 py-4 flex flex-col gap-4 text-sm font-medium shadow-xl absolute w-full left-0 top-[68px] z-40 animate-fadeIn'>
                    <Link href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className='py-2.5 hover:text-indigo-300 transition-colors'
                    >
                        Dashboard
                    </Link>

                    <Link href="/input"
                        onClick={() => setIsMenuOpen(false)}
                        className='py-2.5 hover:text-indigo-300 transition-colors'
                    >
                        Input Transaksi
                    </Link>

                    <Link href="/history"
                        onClick={() => setIsMenuOpen(false)}
                        className='py-2.5 hover:text-indigo-300 transition-colors'
                    >
                        History
                    </Link>

                    <Link href="/settings" className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-full transition-all group">
                        <img
                            src={user?.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.name || user?.email || 'Kenznics')}`}
                            alt="Profile"
                            className="w-7 h-7 rounded-full object-cover border border-indigo-400/50 group-hover:scale-105 transition-transform"
                        />
                        <span className="text-xs font-bold text-indigo-200 group-hover:text-white max-w-[100px] truncate">
                            {user?.name || 'Profile'}
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                        }}
                        className="px-4 py-2.5 bg-red-500 text-white-600 font-bold rounded-xl shadow hover:bg-emerald-400 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </>
    );
}
