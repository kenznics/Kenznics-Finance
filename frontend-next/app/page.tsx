"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Selamat Datang di Kenznics Finance
        </h1>
        <p className="text-sm text-slate-400">
          Menyiapkan Dashboard Keuangan Anda...
        </p>
        <div className="mt-6 w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}