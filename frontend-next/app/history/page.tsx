"use client"

import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

const SkeletonTable = dynamic(() => import('@/components/SkeletonTable'), {
    ssr: false, // Next.js akan merender komponen ini di browser
    loading: () => <div className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 items-center" />
    // Fungsi Placeholder selama proses SSR di server
});

export default function HistoryPage() {

    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const [debounceSearch, setDebounceSearch] = useState<string>('');

    // Logika Debounce: Menunda pembaruan nilai search selama 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearch(search)
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const queryClient = useQueryClient();

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', page, debounceSearch],
        queryFn: async () => {
            const response = await fetch(`/api/transactions?page=${page}&search=${encodeURIComponent(debounceSearch.trim())}`);
            if (!response.ok) throw new Error('Gagal mengambil data riwayat');
            return response.json();
        },
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || 'Gagal menghapus transaksi!');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transaksi berhasil dihapus!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Gagal menghapus transaksi!')
        }
    });

    const handleDelete = (id: number) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="text-sm font-medium text-slate-800">
                    Apakah Anda yakin menghapus transaksi ini?
                </p>

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-rose-500 
                        rounded-lg transition-colors hover:text-white cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            deleteMutation.mutate(id);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 hover:bg-emerald-400 
                    rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity, // Menjaga toast tetap terbuka sampai user memilih tindakan
            position: 'top-center',
        });
    };

    if (isLoading) {
        return <SkeletonTable />
    }

    interface BackendReponse {
        data?: { id: number; title: string; type: string; amount: number }[];
        transactions?: { id: number; title: string; type: string; amount: number }[];
    }

    const resData = transactions as BackendReponse | undefined;
    const rawList = Array.isArray(transactions)
        ? transactions
        : resData?.data || resData?.transactions || [];

    // Mengambil hanya 5 data teratas di tabel
    const transactionList = rawList.slice(0, 5);

    // Menyimpan indikator apakah database mengembalikan data ke-6 (artinya halaman berikutnya terisi minimal 1 data)
    const hasNextPage = rawList.length > 5;


    return (
        <Suspense fallback={<SkeletonTable />}>
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

                    {/* Input Pencarian Minimalis */}
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Cari kata kunci transaksi..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-white borde border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none 
                        focus:border-blue-500 placeholder-slate-400 shadow-sm transition-all"
                        />
                    </div>

                    {/* Kotak Border wadah */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-center items-center min-h-50">

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

                        {/* Navigasi Pembagian Halaman */}
                        <div className="flex items-center justify-between w-full mt-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                className="bg-slate-100 hover:bg-slate-200 disable:opacity-40 disable:hover:bg-slate-100 
                                text-slate-700 text=xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer disable:cursor-not-allowed"
                            >
                                ← Sebelumnya
                            </button>

                            <span className="text-slate-500 text-xs font-semibold">
                                Halaman <strong className="text-slate-800 font-extrabold">{page}</strong>
                            </span>

                            <button
                                disabled={!hasNextPage}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold 
                                px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>

                </main>
                <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 9999 }} />
            </div >
        </Suspense>
    );
}  