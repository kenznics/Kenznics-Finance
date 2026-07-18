import { Card } from '../components/Card';
import { ModalTransaction } from '../components/ModalTransaction';
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../context/useAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TenStack Query 
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions', token], // Kunci unik cache data
    queryFn: async () => {
      if (!token) return [];

      const response = await fetch('http://localhost:3000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        throw new Error('Token expired');
      }

      if (!response.ok) throw new Error('Gagal mengambil data');
      const resJSON = await response.json();
      return resJSON.data || resJSON; // Mengembalikan Arrary data
    },
    enabled: !!token,
  });


  const incomeTransaction = transactions.filter((item) => item.type === 'INCOME');
  const expenseTransaction = transactions.filter((item) => item.type === 'EXPENSE');

  const totalIncome = incomeTransaction.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseTransaction.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6">
      {/* Memasang Navabar diatas */}

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
            className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-blue-50 transition-colors mt-4">
            + Tambah Transaksi
          </button>
        </div>
      </main>

      <ModalTransaction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSucces={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })} // Kirim fungsi fetchTransactions sebagai props ke ModalTransaction
      />

      {/* Toaster Notifikasi */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          // Durasi Popup toaster
          duration: 2000
        }}
      />
    </div>
  );
}

export default Dashboard;
