"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        window.location.href = "/";
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-2xl text-white animate-pulse">
                    Halaman tidak ditemukan, Mengalihkan Anda kembali...
                </h1>
            </div>
        </div>
    );
}