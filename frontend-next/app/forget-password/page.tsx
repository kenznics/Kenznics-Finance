'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgetPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Terjadi kesalahan, coba lagi nanti.');
                setIsLoading(false);
                return;
            }

            // Menampilkan pesan sukses bawaan backend
            setMessage(data.message || 'Tautan reset sukses dikirim!');
        } catch (err) {
            setError('Gagal terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kenznics Finance</h1>
                    <p className="text-sm text-slate-500 mt-1">Pemulihan Akun Lupa Kata Sandi</p>
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

                    {/* Input Email Pemulihan */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">Alamat Email Anda</label>
                        <input
                            type="email"
                            className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-indigo-500 text-black"
                            placeholder="contoh: name@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tombol Kirim Tautan */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-emerald-400 disabled:bg-slate-400
            text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer transition-colors"
                    >
                        {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>

                    {/* Kembali ke Login */}
                    <p className="text-xs text-center text-slate-500 mt-4">
                        Kembali ke halaman{' '}
                        <Link href="/login" className="text-blue-600 hover:text-emerald-500 font-semibold transition-colors">
                            Masuk
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}
