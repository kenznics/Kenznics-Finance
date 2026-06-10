import { useState, useEffect } from 'react';
import { Card }  from  '../components/Card';
import { Navbar }  from '../components/Navbar';
import { ModalTransaction } from '../components/ModalTransaction';
import { Toaster } from 'react-hot-toast'

// Struktur interface Transaksi
interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  createdAt: string;
}

function Dashboard() {
  // Buat state khusus untuk mengatur apakah modal terbuka atau tidak, dengan tipe data boolean
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc4MTA4NTYwMiwiZXhwIjoxNzgxMTcyMDAyfQ.vFI6NZ3afJF-1TCMHpExxAMb0hLYJvE7eA7qevxg7YM'
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

  const incomeTransaction = transactions.filter((item) => item.type === 'INCOME');
  const expenseTransaction = transactions.filter((item) => item.type === 'EXPENSE');

  const totalIncome = incomeTransaction.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseTransaction.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6">
        {/* Memasang Navabar diatas */}

      <Navbar />
      {/* Memanggil Variable angka langsung di dalam HTML menggunakan kurung kurawal */}   
    <main className="p-6 w-full max-w-4xl flex flex-col gap-6 items-center justify-center mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <Card title="Total Pemasukkan" amount={`Rp ${totalIncome.toLocaleString('id-ID')}`} bgColor="bg-green-200 border-green-300" /> 
        <Card title="Total Pengeluaran" amount={`Rp ${totalExpense.toLocaleString('id-ID')}`} bgColor="bg-red-200 border-red-300" /> 
      </div>

      {/* Membuat kotak biru Tombol Pemicu Modal */}
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md text-center w-full max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold">Halo Full-Stack Developer</h2>
          <p className="mt-2 text-blue-100 text-sm">Klik tombol ini untuk meguji State Modal React.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} 
        className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-x1 shadow hover:bg-blue-50 transition-colors mt-4">
          + Tambah Transaksi
        </button>
      </div>
    </main>

      <ModalTransaction isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onFetch={fetchTransactions} // Kirim fungsi fetchTransactions sebagai props ke ModalTransaction
      />

    {/* Toaster Notifikasi */}
    <Toaster 
        position="top-right" 
        reverseOrder={false}
        containerStyle={{ zIndex: 9999 }} 
    />
    </div>
  );
}

export default Dashboard;
