const appDiv = document.querySelector<HTMLDivElement>('#app');
import './style.css';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { ModalTransaction } from './components/ModalTransaction';

if (appDiv) {
  appDiv.innerHTML = /* html */ `
  ${Navbar()}
  <main class="p-6 max-w-7x1 mx-auto space-y-6">
    <!-- Pembungkus Grind: Berisi 2 kolom pada layar md ke atas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      ${Card('Total Pemasukkan', 'Rp 5.000.000', 'bg-green-200 text-green-800 border-green-300')}
      ${Card('Total Pengeluaran', 'Rp 2.500.000', 'bg-red-200 text-red-700 border-red-300')}
    </div>

  <!-- Kotak selamat datang kamu yang warna biru taruh sini! -->
  <div class= "bg-blue-600 text white p-6 rounded-lg text-center shadow-md">
  <div>
    <h1 class= "text-2xl font-bold">Halo Full-Stack Developer</h1>
    <p class="mt-2 text-blue-100">Fase 1 Front END DOM & Tailwind berhasil terhubung.</p>
  </div>
  <!-- Tombol ini kadang ditembak menggunakan ID -->
  <button id="btn-add-transaction" class="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-x1 shadow hover:bg-blue-50 transition-colors">
    + Tambah Transaksi
    </button>
  </div>
</main>

  <!-- Panggil Modal di paling bawah agar meredam layar saat aktif -->
  ${ModalTransaction()}
  `;
}

const btnAdd = document.getElementById('btn-add-transaction') as HTMLButtonElement;
const btnClose = document.getElementById('btn-close-modal') as HTMLButtonElement;
const modal = document.getElementById('modal-transaction') as HTMLDivElement;

// Fungsi untuk membuka modal (menghapus kelas hidden)
btnAdd?.addEventListener('click', () => {
  modal?.classList.remove('hidden');
});

// Fungsi untuk menutup modal (menambahkan kembali kelas Hhidden)
btnClose?.addEventListener('click', () => {
  modal?.classList.add('hidden');
});

// Mengambil element form dan element input berdasarkan ID
const formTransaction = document.getElementById('form-transaction') as HTMLFormElement;

// Pasang element event listerner ketika form di submit
formTransaction?.addEventListener('submit', (event) => {
  //mencegah browser agar tidak melakukkan reload halaman otomatis
  event.preventDefault();

const inputTitle = document.getElementById('modal-title') as HTMLInputElement;
const inputAmount = document.getElementById('modal-amount') as HTMLInputElement;
const selectType = document.getElementById('modal-type') as HTMLSelectElement;


  const titleValue = inputTitle.value;
  const amountValue = inputAmount.value;
  const typeValue = selectType.value;

// Siapkan data objek yang mau dikirim (pastikan nama key sesuai dengan skema Prisma backend-mu!)
const dataTransaksi = {
  title: titleValue,
  amount: Number(amountValue), // teks input menjadi angka
  type: typeValue
};

// Memanggil Fetch untuk mengirim data ke express
fetch('http://localhost:3000/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // Format ke backend JSON
    // Sisipkan token JWT Login disini agar lolos login authMiddleware backend!
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc4MDczNDQwOCwiZXhwIjoxNzgwODIwODA4fQ.Qz1fAzP4pfZRHOBUxWj-OOwba03pQh0BnxH1n4PM-ng'
  },
  body: JSON.stringify(dataTransaksi) // Mengubah objek diatas menjadi teks
})
.then(response => {
  if (!response.ok) {
    throw new Error('Gagal menyimpan data ke database backend');
  }
  return response.json();
})

.then(hasil => {
  console.log('Sukses! Data berhasil masuk ke database!', hasil);

  // Setelah berhasil menangkap data, bersihkan form dan tutup kembali modalnya
  formTransaction.reset();
  modal?.classList.add('hidden');
})

.catch(error => {
  console.error('Ada Masalah saat mengirim data:', error.message)
})

});