interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ModalTransaction({ isOpen, onClose }: ModalProps) {
    // Isi state isOpen bernilai false, jangan tampilkan apa-apa
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2x1 w-full max-w-md p-6 flex flex-col gap-4 p-6 shadow-2xl">
                <h3 className="text-xl font-extrabold text-gray-950">Tambah Transaksi Baru</h3>

            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Nomimal (Rp)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white" required />
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
</div>
    );
}