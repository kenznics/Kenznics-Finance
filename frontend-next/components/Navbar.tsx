"use client";

import { useAuth } from "@/app/context/useAuth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const hiddenRoutes = ['/login', '/', '/register'];

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
        <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="font-bold text-xl tracking-tight text-indigo-400">
                Kenznics Finance
            </div>

            <div className="flex gap-4 text-sm font-medium">
                <Link href="/dashboard" className="py-2.5 hover:text-indigo-300 transition-colors">
                    Dashboard
                </Link>

                <Link href="/input" className="py-2.5 hover:text-indigo-300 transition-colors">
                    Input Transaksi
                </Link>

                <Link href="/history" className="py-2.5 hover:text-indigo-300 transition-colors">
                    History
                </Link>

                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-sm font-medium text-indigo-200 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600 shadow-sm">
                            👋 Halo, <span className="font-bold text-white">{user.name || user.email}</span>
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 bg-red-500 text-white-600 font-bold rounded-xl shadow hover:bg-emerald-400 transition-colors">
                    Logout
                </button>
            </div>
        </nav>
    );
}
