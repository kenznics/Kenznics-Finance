"use client"; // Menandakan file ini adalah Client Component

import { useState } from 'react';
import Card from '@/components/Card';

export default function DashboardPage() {
    const [angka, setAngka] = useState(0);

    return (
        <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Card
                    title="Total Pemasukkan"
                    amount="Rp 0"
                    bgColor="bg-emerald-50 border-emerald-100"
                />
                <Card
                    title="Total Pengeluaran"
                    amount="Rp 0"
                    bgColor="bg-rose-50 border-rose-100"
                />
            </div>

            <div className="bg-blue-600 text-whte p-6 rounded-2xl shadow-md text-center w-full mt-4">
                <div>
                    <h2 className="text-2xl font-bold">Hallo Full Stack Developer</h2>
                    <p className="mt-2 text-blue-100 text-sm">
                        Klik Tombol State
                    </p>
                </div>
                <button
                    type="button"
                    className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-blue-50 transition-colors mt-4 text-sm" >
                    + Tambah Transaksi
                </button>
            </div>
        </main>
    );
}