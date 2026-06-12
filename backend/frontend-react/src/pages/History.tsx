import { Navbar } from '../components/Navbar';
import { useState, useEffect } from 'react';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    createAt: string;
}

function History() {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_DEV_TOKEN}`
                }
            });

            if (response.ok) {
                const resJSON = await response.json();
                // Jika Backend membungkus dalam satu objek ambil resJSON.data
                // Jika backend langsung mengirim array , biarkan resJSON
                //setTransactions(resJSON.data || resJSON);
                console.log("Data Mentah dari BackEnd:", resJSON);

                // Membuat Array baru eksplisit agar React wajib merender ulang
                const dataBaru = resJSON.data || resJSON;

                if (Array.isArray(dataBaru)) {
                    setTransactions(dataBaru);
                } else {
                    console.error('Data yang diterima bukan array:', dataBaru);
                }
            }
        } catch (error) {
            console.error('Error saat mengambil transaksi:', error);
        }
    };

    // Menjalankan fungsi fetchTransactions sekali saat komponen pertama kali dimuat 
    useEffect(() => {
        const iniFetch = async () => {
            await fetchTransactions();
        };
        iniFetch();
    }, []); // Pastikan array dependency kosong agar hanya jalan sekali saat mount
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6">
            <Navbar />

            <main className="p-6 w-full max-w-2xl flex flex-col gap-6 mt-10">
                {/* Judul utama */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Riwayat Transaksi
                    </h1>
                    {/* Badge Jumlah data */}
                    <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                        Total: {transactions.length} Transaksi
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
                                </tr>
                            </thead>

                            {/* Body Data Dumy statis */}
                            <tbody className="text-slate-600 divide-y divide-slate-100 text-sm">
                                {transactions.map((item) => {
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

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>

            </main>
        </div>
    );
}

export default History;