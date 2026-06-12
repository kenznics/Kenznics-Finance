import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";

const transactionSchema = z.object({
    title: z.string().min(3, { message: "Judul minimal harus 3 karakter" }),
    amount: z.number().min(1, { message: "Nominal uang tidak boleh kosong atau 0" }),
    type: z.enum(["INCOME", "EXPENSE"]),
});

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFetch: () => void; // Tambahkan props onFetch untuk menerima fungsi fetchTransactions dari App.tsx
}

export function ModalTransaction({ isOpen, onClose, onFetch }: ModalProps) {
    const [isLoading, setIsLoading] = useState(false); // State biar tombol tidak terklik double

    const { register, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(transactionSchema),
    });

    const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
        try {
            setIsLoading(true); // Loading di awal block try
            console.log("Mengirim data:", data);

            // 1. Kirim data ke API backend Express
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_DEV_TOKEN}`
        },
        body: JSON.stringify(data)
    });

    console.log("Response Status:", response.status, response.ok);

    // Cek response backend
    if (response.ok) {
        console.log("Sukses!");
        // Alert Toast Sukses
        toast.success('Transaksi berhasil disimpan!', {
            duration: 2000,
            icon: '🚀',
        });
        onFetch();
        reset({
            title: "",
            amount: undefined,
            type: "INCOME"
        }); // Mengosongkan form React Hook otomatis
        onClose(); // Panggil fungsi fetchTransactions dari App.tsx untuk refresh data transaksi
    } else {
        console.log("Gagal dengan status:", response.status);
        try {
        const error = await response.json();
        console.log("Eror dari server:", error);
        toast.error(error.message || 'Transaksi gagal disimpan!');
        } catch (parseError) {
            console.error("Tidak bisa parse Response sebagai JSON:", parseError);
            toast.error(`Error ${response.status}: ${response.statusText}`);
        }
    }
        } catch (error) {
            console.error('Error saat menyimpan transaksi:', error);
            // Toast Error koneksi/cors
            toast.error('Gagal terhubung ke server!');
        } finally {
            setIsLoading(false);
            console.log("Loading Selesai");
        }
    };

    // Isi state isOpen bernilai false, jangan tampilkan apa-apa
    if (!isOpen) return null;

    return (
        // Lapisan Latar belakang
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

            {/* Lapisan Konten Modal */}
            <div className="bg-white rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
                <h3 className="text-xl font-extrabold text-gray-950">Tambah Transaksi Baru</h3>
                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit(onSubmit)}>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Judul</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            placeholder="Contoh: Gaji Bulan Juni"
                            disabled={isLoading}
                            {...register("title")}
                        />
                    </div>
                    {errors.title && <span className="text-xs text-red-500 font-medium">{errors.title.message}</span>}

                    {/* Block Input Amount */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Nominal (Rp)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            required
                            placeholder="Contoh: 500000"
                            disabled={isLoading}
                            {...register("amount", { valueAsNumber: true })}
                        />
                    </div>
                    {errors.amount && <span className="text-xs text-red-500 font-medium">{errors.amount.message}</span>}

                    {/* Block Select Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Jenis Transaksi</label>
                        <select
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white" required
                            disabled={isLoading}
                            {...register("type")}
                        >
                            <option value="INCOME">Pemasukan</option>
                            <option value="EXPENSE">Pengeluaran</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        {/* Saat tombol Batal diklik, jalankan fungsi onClose dari App.tsx */}
                        <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors">
                            Batal
                        </button>

                        <button 
                        type="submit"
                        disabled={isLoading} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div >

    );
}