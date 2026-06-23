"use client"; // Menandakan file ini adalah Client Component

import { useState } from 'react';
import Card from '@/components/Card';
import ModalTransaction from '@/components/ModalTransaction';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import SkeletonTable from '@/components/SkeletonTable';

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
    interface BackendReponse {
        data?: { id: number; title: string; type: string; amount: number }[];
        transactions?: { id: number; title: string; type: string; amount: number }[];
    }

    // Menyamarkan tipe Type Assertion
    const resData = transactions as BackendReponse | undefined;
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

    return (
        <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Card
                    title="Total Pemasukkan"
                    amount={`Rp ${totalIncome.toLocaleString('id-ID')}`} // Menggunakan variable reaktif dengan format rupiah
                    bgColor="bg-emerald-50 border-emerald-100"
                />
                <Card
                    title="Total Pengeluaran"
                    amount={`Rp ${totalExpense.toLocaleString(`id-ID`)}`} //
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
    );
}