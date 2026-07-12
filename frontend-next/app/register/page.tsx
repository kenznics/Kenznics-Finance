"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

// Skema validasi formulir registrasi dengan zod
const registerSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid!" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok!",
    path: ["confirmPassword"],
});

type RegisterFormInput = z.infer<typeof registerSchema>;

export default function Register() {
    const navigate = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: RegisterFormInput) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            const resJSON = await response.json();

            if (response.ok) {
                toast.success('Pendaftaran akun berhasil! Silahkan login.');
                navigate.push('/login'); // Mengalihkan ke login
            } else {
                toast.error(resJSON.error || 'Pendaftaran akun gagal!');
            }
        } catch (error) {
            console.error('Error saat melakukkan registerasi', error);
            toast.error('Terjadi kesalahan pada koneksi server');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kenznics Finance</h1>
                    <p className="text-sm text-slate-500 mt-1">Daftar Akun Baru Anda</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Kolom Input Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder='nama@gmail.com'
                        />
                        {errors.email && <span className="text-xs text-rose-500 font-medium">{errors.email.message}</span>}
                    </div>


                    {/* Kolom Input Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder='••••••'
                        />
                        {errors.password && <span className="text-xs text-rose-500 font-medium">{errors.password.message}</span>}
                    </div>


                    {/* Kolom Input Konfirmasi Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Konfirmasi Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder='••••••'
                        />
                        {errors.confirmPassword && <span className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-emerald-400 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer transition-colors"
                    >
                        Daftar Akun
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        Sudah memiliki akun? {' '}
                        <Link href="/login" className="text-blue-600 hover:text-emerald-500 font-semibold transition-colors">
                            Masuk di sini
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}


