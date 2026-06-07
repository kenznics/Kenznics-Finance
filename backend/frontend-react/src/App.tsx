import { useState } from 'react';
import { Card }  from  './components/Card';
import { Navbar }  from './components/Navbar';
import { ModalTransaction } from './components/ModalTransaction';

function App() {
  const [angka, setAngka] = useState<number>(0);
  // Buat state khusus untuk mengatur apakah modal terbuka atau tidak, dengan tipe data boolean
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center gap-6">
        {/* Memasang Navabar diatas */}
      <Navbar />
      {/* Memanggil Variable angka langsung di dalam HTML menggunakan kurung kurawal */}   
    <main className="p-6 w-full max-w-4xl flex flex-col gap-6 items-center justify-center mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <Card title="Total Pemasukkan" amount="Rp 5.000.000" bgColor="bg-green-200 border-green-300" /> 
        <Card title="Total Pengeluaran" amount="Rp 2.500.000" bgColor="bg-red-200 border-red-300" /> 
      </div>

      {/* Membuat kotak biru Tombol Pemicu Modal */}
      <div className="bg-blue-600 text-white p-6 rounded-x1 shadow-md text-center w-full max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold">Halo Full-Stack Developer</h2>
          <p className="mt-2 text-blue-100 text-sm">Klik tombol ini untuk meguji State Modal React.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} 
        className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-x1 shadow hover:bg-blue-50 transition-colors mt-4">
          + Tambah Transaksi
        </button>
      </div>

    <p className="text-gray-700 text-lg">
      Status Gerbang Modal Saat ini: <span className="font-bold text-gray-900">{isModalOpen ? 'Terbuka' : 'Tertutup'}</span>
    </p>
    </main>

        <div className="mt-4 flex flex-col items-center gap-1">
        <p className="text-sm text-gray-500 font-medium">Total Klik Penghitung: {angka}</p>
        <button onClick={() => setAngka(angka + 1)} className="px-3 py-1 bg-gray-200 text-xs font-bold rounded-lg text-gray-700">
          Tes useState Angka 
        </button>
      </div>

      <ModalTransaction isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}

export default App;
