"use client"; // Menandakan file ini adalah Client Component

import { useMemo } from 'react';
import Card from '@/components/Card';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SkeletonTable = dynamic(() => import('@/components/SkeletonTable'), {
    ssr: false, // Next.js akan merender komponen ini di browser
    loading: () => <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 items-center" />
    // Fungsi Placeholder selama proses SSR di server
});

interface BackendTransaction {
    id: number;
    title: string;
    type: string;
    amount: number;
    createdAt?: string;
}

interface BackendResponse {
    data?: BackendResponse[];
    transactions?: BackendTransaction[];
}

interface TransactionItem extends BackendTransaction {
    runningBalance: number;
}

export default function DashboardPage() {

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const response = await fetch('/api/transactions', {
                headers: {
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data');
            return response.json();
        },
    });

    //1. Mengambil List data transaksi mentah 
    const transactionList = useMemo(() => {
        if (!transactions) return [];
        const resData = transactions as BackendResponse;
        return Array.isArray(transactions)
            ? transactions
            : resData?.data || resData?.transactions || [];
    }, [transactions]);

    const { totalIncome, totalExpense } = useMemo(() => {
        let income = 0;
        let expense = 0;

        transactionList.forEach((t: BackendTransaction) => {
            if (t.type === 'INCOME') income += t.amount;
            if (t.type === 'EXPENSE') expense += t.amount;
        });

        return { totalIncome: income, totalExpense: expense };
    }, [transactionList]);

    const latestTransactions = useMemo(() => {
        if (transactionList.length === 0) return [];

        const chronologicalTransactions = [...transactionList].sort(
            (a, b) => new Date(a.createAt || 0).getTime() - new Date(b.createAt || 0).getTime()
        );

        // 2. Gunakan .reduce secara mandiri di luar perulangan map
        const transactionWithBalance = chronologicalTransactions.reduce((acc: TransactionItem[], t: BackendTransaction) => {
            const previousBalance = acc.length > 0 ? acc[acc.length - 1].runningBalance : 0;

            let newBalance = previousBalance;
            if (t.type === 'INCOME') {
                newBalance += t.amount;
            } else if (t.type === 'EXPENSE') {
                newBalance -= t.amount;
            }

            acc.push({ ...t, runningBalance: newBalance });
            return acc;
        }, []);

        return [...transactionWithBalance].reverse();
    }, [transactionList]);

    if (isLoading) return <SkeletonTable />

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

                <div className="md:col-span-2 flex justify-center w-full">
                    <div className="w-full md:w-1/2">
                        <Card
                            title="Total Sisa Saldo"
                            amount={`Rp ${(totalIncome - totalExpense).toLocaleString('id-ID')}`}
                            bgColor="bg-blue-50 border-blue-100"
                        />
                    </div>
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
                            latestTransactions.map((t: { id: number; title: string; type: string; amount: number; runningBalance: number; createAt?: string }) => (
                                <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 border border-gray-800 rounded-xl gap-2">

                                    <div className='flex flex-col'>
                                        <span className='font-semibold text-sm text-gray-200'>{t.title}</span>
                                        <span className="text-gray-400 text-xs">
                                            {t.createAt
                                                ? new Date(t.createAt).toLocaleString('id-ID', {
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
            </main>
        </Suspense>
    );
}
