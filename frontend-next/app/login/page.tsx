"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/useAuth';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import Link from 'next/link';

// Definisi aturan validasi form dengan Zod
const loginSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter!" }),
    rememberMe: z.boolean().optional(),
});

// Tipe data TS berdasarkana skema Zod diatas
type LoginFormInput = z.infer<typeof loginSchema>;

export default function Login() {
    // Inisialiasi react hook form dengan skema Zod
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    });

    // Fungsi login global dan navigasi halaman
    const { login } = useAuth();
    const navigate = useRouter();

    // Fungsi untuk menangani pengiriman data form submit (handler)
    const onSubmit = async (data: LoginFormInput) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const resJSON = await response.json();
                // Simpan Token dari backend ke dalam state global
                login(resJSON.token);
                // Setelah token disimpan, langsung ke dashboard
                toast.success('Anda Berhasil Login!');
                navigate.push('/');
            } else {
                toast.error('Email atau Password salah!')
            }
        } catch (error) {
            console.error('Error saat melakukkan login', error);
        }
    };

    // Bagian Return HTML/UI Form 
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kenznics Finance</h1>
                    <p className="text-sm slate-500 mt-1">Silahkan Masukkan Akun Anda</p>
                </div>

                {/* Menghubungkan Form dengan HandleSubmit react-hook-form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Input Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
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
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder="••••••"
                        />
                        {errors.password && <span className="text-xs text-rose-500 font-medium">{errors.password.message}</span>}
                    </div>

                    <div className='flex items-center gap-2 mt-1'>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            {...register('rememberMe')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor='rememberMe' className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                            Remember This Device
                        </label>
                    </div>

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-emerald-400 
                        text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                    >
                        Masuk
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
        </div >
    );
}