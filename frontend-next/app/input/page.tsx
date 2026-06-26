"use client";

import ModalTransaction from "@/components/ModalTransaction";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import dynamic from "next/dynamic";
import { Suspense } from 'react';

const SkeletonTable = dynamic(() => import('@/components/SkeletonTable'), {
    ssr: false, // Next.js akan merender komponen ini di browser
    loading: () => <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 items-center" />
    // Fungsi Placeholder selama proses SSR di server
});

export default function InputPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { token } = useAuth();

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', token],
        queryFn: async () => {
            const response = await fetch('/api/transactions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');
            return response.json();
        },
        enabled: !!token,
    });

    if (isLoading) return <SkeletonTable />

    return (
        <Suspense fallback={<SkeletonTable />}>
            <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6">

                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md text-center w-full mt-4">
                    <div>
                        <h2 className="text-2xl font-bold">Sudahkah Bertransaksi Hari Ini?</h2>
                        <p className="mt-2 text-blue-100 text-sm">
                            Tambahkan Transaksi
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-gray-400 transition-colors mt-4 text-sm" >
                        + Tambah Transaksi
                    </button>
                </div>

                <ModalTransaction
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

            </main>
        </Suspense>
    );
}

