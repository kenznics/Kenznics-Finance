"use client"

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';
import { Toaster, toast } from 'react-hot-toast';
import SkeletonTable from '@/components/SkeletonTable';

export default function HistoryPage() {

    const { token } = useAuth();
    const queryClient = useQueryClient();

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', token],

        queryFn: async () => {

            const response = await fetch('http://localhost:3000/api/transactions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Gagal mengambil data riwayat');
            return response.json();
        },
        enabled: !!token,
    });

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Re-ftetch otomatis ke backend
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                toast.success('Transaksi berhasil dihapus!');
            } else {
                toast.error('Gagal Menghapus Transaksi!');
            }
        } catch (error) {
            toast.error('Terjadi Kesalahan Jaringan.');
        }
    };

    if (isLoading) {
        return <SkeletonTable />
    }

    interface BackendReponse {
        data?: { id: number; title: string; type: string; amount: number }[];
        transactions?: { id: number; title: string; type: string; amount: number }[];
    }

    const resData = transactions as BackendReponse | undefined;
    const transactionList = Array.isArray(transactions)
        ? transactions
        : resData?.data || resData?.transactions || [];

    return (
        <div className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 items-center">

            <main className="p-6 w-full max-w-2xl flex flex-col gap-6 mt-10">
                {/* Judul utama */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">
                        Riwayat Transaksi
                    </h1>
                    {/* Badge Jumlah data */}
                    <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                        Total: {(transactions || []).length} Transaksi
                    </span>
                </div>

                {/* Kotak Border wadah */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-center items-center min-h-[200px]">

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            {/* Header Table*/}
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
                                    <th className="py-4 px-6 font-semibold">Judul Transaksi</th>
                                    <th className="py-4 px-6 font-semibold">Tipe</th>
                                    <th className="py-4 px-6 font-semibold text-center">Jumlah</th>
                                    <th className="py-4 px-6 font-semibold text-right">Waktu</th>
                                    <th className="px-4 py-6 text-center">Aksi</th>
                                </tr>
                            </thead>

                            {/* Body Data Dumy statis */}
                            <tbody className="text-slate-600 divide-y divide-slate-100 text-sm">
                                {transactionList.map((item) => {
                                    return (
                                        <tr key={item.id} className="hover:bg slate-50/80 transition-colors">
                                            {/* Kolom Judul */}
                                            <td className="py-4 px-6 font-medium text-slate-900">
                                                {item.title}
                                            </td>

                                            {/* Kolom Conditional warna untuk tipe data */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.type === 'INCOME'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>

                                            {/* Kolom Tanda Warna angka dan Format uangnya */}
                                            <td className={`py-4 px-6 text-right font-bold ${item.type === 'INCOME'
                                                ? 'text-emerald-600'
                                                : 'text-rose-600'
                                                }`}>
                                                {item.type === 'INCOME' ? '+ ' : '- '}
                                                Rp {item.amount.toLocaleString('id-ID')}
                                            </td>

                                            {/* Kolom Waktu */}
                                            <td className="py-4 px-6 text-right text-slate-400">
                                                {(() => {
                                                    // Jika Data kosong 
                                                    if (!item.createAt) return "-";

                                                    // Mengkonversi string menjadi objek Date
                                                    const dateObj = new Date(item.createAt);

                                                    // Periksa hasil apakah valid
                                                    if (isNaN(dateObj.getTime())) {
                                                        // Jika invalid Date , tampilkan string sebagai tek
                                                        return item.createAt;
                                                    }

                                                    // Jika valid, format Indonesia
                                                    return dateObj.toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })
                                                })()}
                                            </td>

                                            <td className="py-4 px-6 text-center text-slate-400">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="bg-rose-500 hover:bg-emerald-500 text-white font-medium 
                                                px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm">
                                                    Hapus
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>

            </main>
            <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 9999 }} />
        </div >
    );
}  