"use client"; // Menandakan file ini adalah Client Component

import { useState } from 'react';
import Card from '@/components/Card';
import ModalTransaction from '@/components/ModalTransaction';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SkeletonTable = dynamic(() => import('@/components/SkeletonTable'), {
    ssr: false, // Next.js akan merender komponen ini di browser
    loading: () => <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 items-center" />
    // Fungsi Placeholder selama proses SSR di server
});

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { token } = useAuth();

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', token],
        queryFn: async () => {
            const response = await fetch('http://localhost:3000/api/transactions', {
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

    // Membuat X-ray tipe datanya (interface)
    interface BackendResponse {
        data?: { id: number; title: string; type: string; amount: number; createdAt?: string }[];
        transactions?: { id: number; title: string; type: string; amount: number; createdAt?: string }[];
    }

    // Menyamarkan tipe Type Assertion
    const resData = transactions as BackendResponse | undefined;
    // Pengaman runtime Array.isArray
    const transactionList = Array.isArray(transactions)
        ? transactions
        : resData?.data || resData?.transactions || [];

    const totalIncome = transactionList
        .filter((t: { type: string; amount: number }) => t.type === 'INCOME')
        .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

    const totalExpense = transactionList
        .filter((t: { type: string; amount: number }) => t.type === 'EXPENSE')
        .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

    // 1. Urutkan dari transaksi paling lama ke paling baru
    const chronologicalTransactions = [...transactionList].sort(
        (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );

    interface TransactionItem {
        id: number;
        title: string;
        type: string;
        amount: number;
        createdAt?: string;
        runningBalance?: number;
    }

    // 2. Gunakan .reduce secara mandiri di luar perulangan map
    const transactionWithBalance = chronologicalTransactions.reduce((acc: TransactionItem[], t: TransactionItem) => {
        const item = t;
        const previousBalance = acc.length > 0 ? acc[acc.length - 1].runningBalance || 0 : 0;

        let newBalance = previousBalance;
        if (item.type === 'INCOME') {
            newBalance += item.amount;
        } else if (item.type === 'EXPENSE') {
            newBalance -= item.amount;
        }

        acc.push({ ...item, runningBalance: newBalance });
        return acc;
    }, []);

    // 3. Urutkan agar transaksi terbaru di posisi paling atas halaman
    const latestTransactions = [...transactionWithBalance].reverse();

    return (
        <Suspense fallback={<SkeletonTable />}>
            <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6">

                {/* Ringkasan Saldo Atas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Card
                        title="Total Pemasukkan"
                        amount={`Rp ${totalIncome.toLocaleString('id-ID')}`}
                        bgColor="bg-emerald-50 border-emerald-100"
                    />
                    <Card
                        title="Total Pengeluaran"
                        amount={`Rp ${totalExpense.toLocaleString('id-ID')}`}
                        bgColor="bg-rose-50 border-rose-100"
                    />
                </div>

                {/* Kotak Utama: Rincian Aktivitas */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-md flex flex-col gap-4 w-full">
                    <div>
                        <h3 className="text-lg font-bold text-white">Rincian Aktivitas Transaksi</h3>
                        <p className="text-gray-400 text-xs mt-1">Log perubahan saldo berdasarkan waktu transaksi</p>
                    </div>

                    <div className='flex flex-col gap-3 max-h-75 overflow-y-auto pr-1'>
                        {latestTransactions.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">Belum ada Riwayat Transaksi.</p>
                        ) : (
                            latestTransactions.map((t: { id: number; title: string; type: string; amount: number; runningBalance: number; createdAt?: string }) => (
                                <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 border border-gray-800 rounded-xl gap-2">
                                    <div className='flex flex-col'>
                                        <span className='font-semibold text-sm text-gray-200'>{t.title}</span>
                                        <span className="text-gray-400 text-xs">
                                            {t.createdAt
                                                ? new Date(t.createdAt).toLocaleString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : 'Waktu tidak tersedia'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-1">
                                        <span className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                            Saldo: <strong className="text-gray-300">Rp {t.runningBalance.toLocaleString('id-ID')}</strong>
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Banner Tombol Tambah Transaksi */}
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
