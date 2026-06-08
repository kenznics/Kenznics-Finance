import { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFetch: () => void; // Tambahkan props onFetch untuk menerima fungsi fetchTransactions dari App.tsx
}

export function ModalTransaction({ isOpen, onClose, onFetch }: ModalProps) {

    const [title, setTitle] = useState("");
    const [amountState, setAmountState] = useState("");
    const [type, setType] = useState("INCOME");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1. Kirim data ke API backend Express
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc4MDkwODA4MCwiZXhwIjoxNzgwOTk0NDgwfQ.B_X2ck3ycGYSteXBuAAsF6h4OqcllmZ4oxSEfYjU-nE'
        },
        body: JSON.stringify({
            title,
            amount: Number(amountState),
            type
        })
    });

    // Cek response backend
    if (response.ok) {
        alert('Transaksi Berhasil Di Simpan.');
        onFetch(); // Panggil fungsi fetchTransactions dari App.tsx untuk refresh data transaksi
        onClose(); // Tutup modal jika gagal
    } else {
        alert('Transaksi gagal disimpan!');
    }
        } catch (error) {
            console.error('Error saat menyimpan transaksi:', error);
        }
    };

    // Isi state isOpen bernilai false, jangan tampilkan apa-apa
    if (!isOpen) return null;

    return (
        // Lapisan Latar belakang
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

            {/* Lapisan Konten Modal */}
            <div className="bg-white rounded-2x1 w-full max-w-md p-6 flex flex-col gap-4 p-6 shadow-2xl">

                <h3 className="text-xl font-extrabold text-gray-950">Tambah Transaksi Baru</h3>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Judul</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            placeholder="Contoh: Gaji Bulan Juni"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Block Input Amount */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Nominal (Rp)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            required
                            placeholder="Contoh: 500000"
                            value={amountState}
                            onChange={(e) => setAmountState(e.target.value)}
                        />
                    </div>

                    {/* Block Select Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Jenis Transaksi</label>
                        <select
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white" required
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="INCOME">Pemasukan</option>
                            <option value="EXPENSE">Pengeluaran</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        {/* Saat tombol Batal diklik, jalankan fungsi onClose dari App.tsx */}
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-x1 hover:bg-gray-400 transition-colors">
                            Batal
                        </button>

                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-x1 hover:bg-blue-700 transition-colors">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div >

    );
}