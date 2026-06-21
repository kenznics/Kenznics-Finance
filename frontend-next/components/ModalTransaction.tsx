"use client";

// Type Script Interface
interface ModalTransactionProps {
    isOpen: boolean;
    onClose: () => void;
}

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../app/context/useAuth';

const transactionSchema = z.object({
    title: z.string().min(3, { message: "Deskripsi minimal 3 karakter" }),
    type: z.enum(["INCOME", "EXPENSE"], { message: "Pilih tipe transaksi" }),
    amount: z.number().positive({ message: "Jumlah harus lebih besar dari 0!" }),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export default function ModalTransaction({ isOpen, onClose }: ModalTransactionProps) {
    // Hook UseForm
    const { register, handleSubmit, formState: { errors }, reset } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: "",
            type: "EXPENSE",
        }
    });

    const queryClient = useQueryClient();

    const { token } = useAuth();

    const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log("Pesan Error Backend", errorData);
                throw new Error('Gagal menyimpan transaksi!');
            }

            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            reset();
            onClose();
            console.log("sukses mengirim data!")

        } catch (error) {
            console.error(error);
        }
    };

    // Pengaman 
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="bg-gray-100 rounded-2xl p-6 w-full max-w-md shadow-xl broder border-slate-400 flex flex-col gap-4">

                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-800">Tambah Transaksi Baru</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                    >
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    {/* Input Judul Transaksi */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Judul</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            placeholder="Contoh: Gaji Bulan Juni"
                            {...register("title")}
                        />
                        {errors.title &&
                            <span className="text-xs text-red-500 font-medium">{errors.title.message}</span>}
                    </div>

                    {/* Block Select Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Tipe Transaksi</label>
                        <select
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            {...register("type")}
                        >
                            <option value="INCOME">Pemasukan</option>
                            <option value="EXPENSE">Pengeluaran</option>
                        </select>
                        {errors.type &&
                            <span className="text-xs text-red-500 font-medium">{errors.type.message}</span>}
                    </div>

                    {/* Block Input Amount */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Nominal (Rp)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-xl text-gray-900 bg-white"
                            placeholder="Contoh: 50000"
                            {...register("amount", { valueAsNumber: true })}
                        />
                        {errors.amount &&
                            <span className="text-xs text-red-500 font-medium">{errors.amount.message}</span>}
                    </div>

                    {/* Footer Tombol Aksi */}
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-md"
                        >
                            Simpan
                        </button>
                    </div>
                </form>

            </div>
        </div >
    )
}