'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Logika dan Form
function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Ambil token rahasia dari URL string (?token=XYZ)
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Konfirmasi kata sandi tidak cocok!');
            return;
        }

        try {
            const res = await fetch('api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Gagal memperbarui kata sandi.');
                return;
            }

            setMessage(data.message || 'Kata sandi sukses diperbarui');

            setTimeout(() => {
                router.push('/login')
            }, 2000);

        } catch (err) {
            setError('Terjadi kesalahan, coba lagi nanti.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kenznics Finance</h1>
                    <p className="text-sm text-slate-500 mt-1">Atur Ulang Kata Sandi Akun Anda</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-500 border border-rose-200">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-600 border border-emerald-200">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Input Password Baru */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Kata Sandi Baru</label>
                        <input
                            type="password"
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Input Konfirmasi Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Konfirmasi Kata Sandi Baru</label>
                        <input
                            type="password"
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder="••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-emerald-400 
            text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer transition-colors"
                    >
                        Perbarui Kata Sandi
                    </button>

                    {/* Link Kembali ke Login */}
                    <p className="text-xs text-center text-slate-500 mt-4">
                        Ingat kata sandi Anda?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-emerald-500 font-semibold transition-colors">
                            Masuk di sini
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

// Komponen utama untuk untuk export default
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
