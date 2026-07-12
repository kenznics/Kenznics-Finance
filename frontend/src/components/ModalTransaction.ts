export function ModalTransaction(): string {
    return /* HTML */`
    <!-- Overlay Latar Belakang Gelap (Posisi Abosulute memenuhi layar) -->
    <div id="modal-transaction" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">

    <!-- Kotak Putih Utama Form -->
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2x1 rounded-x1 dynamic-modal">
        <h3 class="text-lg font-bold text-gray-950 mb-4">Tambah Transaksi Baru</h3>

    <!-- Form Input-->
    <form id="form-transaction" class="flex flex-col gap-4">

        <!-- Input Deskripsi (Title)  -->
        <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-700">Deskripsi</label>
            <input type="text" id="modal-title" placeholder="Contoh: Beli Kopi" class="w-full px-4 py-2 border border-gray-300 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white" required />
        </div> 

        <!-- 1. Input Nominal Uang  -->
        <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-700">Nomimal (Rp)</label>
            <input type="number" id="modal-amount" placeholder="Contoh: 50000" class="w-full px-4 py-2 border border-gray-300 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div> 
        
        <!-- 2. Pilihan Jenis Transaksi  -->
        <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-700">Jenis Transaksi</label>
        <select id="modal-type" class="w-full px-4 py-2 border border-gray-300 rounded-x1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="INCOME">Pemasukkan</option>
            <option value="EXPENSE">Pengeluaran</option>
        </select>
        </div>

        <!-- 2. Pilihan Jenis Transaksi  -->
        <div class="flex justify-end gap-3 mt-2">
            <button type="button" id="btn-close-modal" class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-x1 hover:bg-gray-200">Batal</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-x1 hover:bg-blue-700">Simpan</button>
        </div> 
        
    </form>
        </div>
    </div>
    `;
}