"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/useAuth';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter!" }),
    rememberMe: z.boolean().optional(),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export default function Login() {
    // 1. Ambil isSubmitting untuk mencegah klik ganda (spam tombol)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    });

    const { login } = useAuth();
    const navigate = useRouter();

    const onSubmit = async (data: LoginFormInput) => {
        // Hapus toast lama yang mungkin masih menggantung
        toast.dismiss();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resJSON = await response.json();

            if (response.ok) {
                // 2. GUNAKAN AWAIT agar fetchProfile di AuthContext selesai dulu
                await login(resJSON.token || 'logged_in');

                // 3. Munculkan Toast Sukses
                toast.success(resJSON.message || 'Anda Berhasil Login!');

                // 4. BERI JEDA 700ms sebelum pindah halaman agar toast sempat animasi muncul
                setTimeout(() => {
                    navigate.push('/');
                    navigate.refresh();
                }, 700);
            } else {
                // 5. Tampilkan pesan error spesifik dari backend (jika ada)
                toast.error(resJSON.error || resJSON.message || 'Email atau Password salah!');
            }
        } catch (error) {
            console.error('Error saat melakukan login', error);
            toast.error('Terjadi kesalahan koneksi ke server!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kenznics Finance</h1>
                    <p className="text-sm text-slate-500 mt-1">Silakan Masukkan Akun Anda</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Input Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="contoh: name@gmail.com"
                        />
                        {errors.email && <span className="text-xs text-rose-500 font-medium">{errors.email.message}</span>}
                    </div>

                    {/* Input Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="••••••"
                        />
                        {errors.password && <span className="text-xs text-rose-500 font-medium">{errors.password.message}</span>}
                    </div>

                    <div className='flex items-center gap-2 mt-1'>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            {...register('rememberMe')}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label htmlFor='rememberMe' className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                            Remember This Device
                        </label>
                    </div>

                    {/* Tombol Submit dengan Keterangan Loading */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-emerald-400 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </>
                        ) : (
                            'Masuk'
                        )}
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        Belum memiliki akun? {' '}
                        <Link href="/register" className="text-blue-600 hover:text-emerald-500 font-semibold transition-colors">
                            Daftar di sini
                        </Link>
                    </p>

                    <p className="text-xs text-center text-slate-500 mt-2">
                        <Link href="/forget-password" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                            Lupa Kata Sandi?
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}