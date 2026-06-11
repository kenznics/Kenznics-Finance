import { Navbar } from '../components/Navbar';
import { useState, useEffect } from 'react';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    createdAt: string;
}

function History() {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc4MTE3MjM3MywiZXhwIjoxNzgxMjU4NzczfQ.qY5istiP-EVElfRe99k6jQ1Jxxeg4IKs8HSI8q_Y3Bo'
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
                    {/* Mapping transaksi */}
                    <p className="text-sm text-slate-400 italic text-center">
                        Daftar Transaksi
                    </p>
                </div>

            </main>
        </div>
    );
}

export default History;