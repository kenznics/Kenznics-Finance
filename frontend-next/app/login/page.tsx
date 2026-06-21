"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/useAuth';
import { useRouter } from "next/navigation";

// Definisi aturan validasi form dengan Zod
const loginSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter!" }),
});

// Tipe data TS berdasarkana skema Zod diatas
type LoginFormInput = z.infer<typeof loginSchema>;

export default function Login() {
    // Inisialiasi react hook form dengan skema Zod
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    // Fungsi login global dan navigasi halaman
    const { login } = useAuth();
    const navigate = useRouter();

    // Fungsi untuk menangani pengiriman data form submit (handler)
    const onSubmit = async (data: LoginFormInput) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
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
                navigate.push('/');
            } else {
                alert("Login gagal!")
            }
        } catch (error) {
            console.error('Error saat melakukkan login', error);
        }
    };

    // Bagian Return HTML/UI Form 
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6">

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

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        className="mt-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 
                        text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </div >
    );
}