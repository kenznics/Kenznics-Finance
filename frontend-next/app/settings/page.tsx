"use client";

import { useAuth } from '@/app/context/useAuth';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// --- 1. Skema Validasi Zod ---
const profileSchema = z.object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
});

const passwordSchema = z.object({
    oldPassword: z.string().min(1, { message: "Kata sandi lama wajib diisi" }),
    newPassword: z.string().min(6, { message: "Kata sandi baru minimal 6 karakter" }),
    confirmNewPassword: z.string().min(1, { message: "Konfirmasi kata sandi wajib diisi" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi kata sandi baru tidak cocok!",
    path: ["confirmNewPassword"],
});

type ProfileFormInput = z.infer<typeof profileSchema>;
type PasswordFormInput = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const { user, login } = useAuth();
    const [avatarStyle, setAvatarStyle] = useState<'notionists' | 'adventurer' | 'initials'>('notionists');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // State untuk melihat/mengintip kata sandi (Ikon Mata)
    const [showOldPass, setShowOldPass] = useState<boolean>(false);
    const [showNewPass, setShowNewPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    // Setup Form Profil
    const {
        register: regProfile,
        handleSubmit: submitProfile,
        setValue,
        formState: { errors: errProfile, isSubmitting: subProfile }
    } = useForm<ProfileFormInput>({
        resolver: zodResolver(profileSchema),
    });

    // Setup Form Ganti Password
    const {
        register: regPass,
        handleSubmit: submitPass,
        reset: resetPass,
        formState: { errors: errPass, isSubmitting: subPass }
    } = useForm<PasswordFormInput>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (user?.name) {
            setValue('name', user.name);
        }
    }, [user, setValue]);

    // --- 2. Logika URL Avatar (Vercel Blob > Avatar Statis) ---
    const seed = user?.name || user?.email || 'Kenznics';
    const staticAvatarUrl = avatarStyle === 'initials'
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=2563eb&color=fff&size=128&bold=true`
        : `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(seed)}`;

    const displayAvatar = (user as { image?: string })?.image || staticAvatarUrl;

    // --- 3. Handler Upload Gambar ke Vercel Blob ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 2MB!");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await fetch('/api/auth/profile/avatar', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Foto profil berhasil diubah!");
                const token = localStorage.getItem('authToken');
                if (token) login(token);
            } else {
                toast.error(data.error || "Gagal mengupload foto!");
            }
        } catch {
            toast.error("Terjadi kesalahan koneksi ke server saat upload!");
        } finally {
            setIsUploading(false);
        }
    };

    // --- 4. Handler Hapus Gambar dari Vercel Blob ---
    const handleDeleteAvatar = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch('/api/auth/profile/avatar', { method: 'DELETE' });
            const data = await res.json();

            if (res.ok) {
                toast.success("Foto profil dikembalikan ke default!");
                const token = localStorage.getItem('authToken');
                if (token) login(token);
            } else {
                toast.error(data.error || "Gagal menghapus foto");
            }
        } catch {
            toast.error("Terjadi kesalahan koneksi ke server!");
        } finally {
            setIsDeleting(false);
        }
    };

    // --- 5. Handler Update Nama Profil ---
    const onUpdateProfile = async (data: ProfileFormInput) => {
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.name }),
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Nama profil berhasil diperbarui!');
                const token = localStorage.getItem('authToken');
                if (token) login(token);
            } else {
                toast.error(result.error || 'Gagal memperbarui profil');
            }
        } catch {
            toast.error('Terjadi kesalahan koneksi ke server');
        }
    };

    // --- 6. Handler Update Password ---
    const onUpdatePassword = async (data: PasswordFormInput) => {
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword
                }),
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Kata sandi berhasil diganti!');
                resetPass();
            } else {
                toast.error(result.error || 'Gagal mengganti kata sandi');
            }
        } catch {
            toast.error('Terjadi kesalahan koneksi ke server');
        }
    };

    return (
        <main className="p-6 w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6 text-white">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-blue-500">Pengaturan Akun</h1>
                <p className="text-xs text-slate-400 mt-1">
                    Kelola informasi profil, avatar otomatis atau upload cloud, dan keamanan kata sandi Anda
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* --- KARTU AVATAR --- */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-fit shadow-md">

                    {/* Wadah Relative untuk menampung Avatar & Tombol Tong Sampah */}
                    <div className="relative w-28 h-28 group">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-blue-500/50 bg-slate-800 shadow-lg relative">
                            <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />

                            {/* Overlay Tombol Upload saat Hover */}
                            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold text-white">
                                <span className="text-center px-1">
                                    {isUploading ? "Mengupload..." : "📷 Ganti Foto"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading || isDeleting}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Tombol Tong Sampah */}
                        {(user as { image?: string })?.image && (
                            <button
                                type="button"
                                onClick={handleDeleteAvatar}
                                disabled={isDeleting || isUploading}
                                title="Hapus Foto Cloud"
                                className="absolute top-0 right-0 bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-full shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer border border-gray-900 hover:scale-110"
                            >
                                {isDeleting ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    <div>
                        <h3 className="font-bold text-sm text-slate-200">{user?.name || 'Pengguna Tanpa Nama'}</h3>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>

                    {/* Pilihan Gaya Avatar Statis */}
                    <div className="w-full border-t border-gray-800 pt-3 mt-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                            Gaya Avatar
                        </label>

                        <div className="flex justify-center gap-1">
                            <button
                                type="button"
                                onClick={() => setAvatarStyle('notionists')}
                                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${avatarStyle === 'notionists' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-slate-400 hover:text-white'}`}
                            >
                                Modern
                            </button>

                            <button
                                type="button"
                                onClick={() => setAvatarStyle('initials')}
                                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${avatarStyle === 'initials' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-slate-400 hover:text-white'}`}
                            >
                                Inisial
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- KARTU FORM PENGATURAN --- */}
                <div className="md:col-span-2 flex flex-col gap-6">

                    {/* FORM GANTI NAMA */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col gap-4 shadow-md">
                        <h2 className="text-base font-bold text-white border-b border-gray-800 pb-3">Informasi Profil</h2>

                        <form onSubmit={submitProfile(onUpdateProfile)} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400">Nama Tampilan</label>
                                <input
                                    type="text"
                                    {...regProfile('name')}
                                    placeholder="Masukkan nama Anda..."
                                    className="px-4 py-2 border border-gray-700 bg-gray-800 rounded-xl text-sm text-white focus:outline-blue-500"
                                />
                                {errProfile.name && (
                                    <span className="text-xs text-rose-500 font-medium">{errProfile.name.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400">Email (Tidak dapat diubah)</label>
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="px-4 py-2 border border-gray-800 bg-gray-800/50 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={subProfile}
                                className="self-end px-5 py-2 bg-blue-600 hover:bg-emerald-400 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                            >
                                {subProfile ? 'Menyimpan...' : 'Simpan Nama'}
                            </button>
                        </form>
                    </div>

                    {/* FORM GANTI PASSWORD */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col gap-4 shadow-md">
                        <h2 className="text-base font-bold text-white border-b border-gray-800 pb-3">Ganti Kata Sandi</h2>

                        <form onSubmit={submitPass(onUpdatePassword)} className="flex flex-col gap-4">

                            {/* 1. Kata Sandi Saat Ini */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-400">Kata Sandi Saat Ini</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showOldPass ? "text" : "password"}
                                        {...regPass('oldPassword')}
                                        placeholder="••••••"
                                        className="w-full pl-4 pr-10 py-2 border border-gray-700 bg-gray-800 rounded-xl text-sm text-white focus:outline-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPass(!showOldPass)}
                                        className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                                    >
                                        {showOldPass ? (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        )}
                                    </button>
                                </div>
                                {errPass.oldPassword && (
                                    <span className="text-xs text-rose-500 font-medium">{errPass.oldPassword.message}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 2. Kata Sandi Baru */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400">Kata Sandi Baru</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            {...regPass('newPassword')}
                                            placeholder="••••••"
                                            className="w-full pl-4 pr-10 py-2 border border-gray-700 bg-gray-800 rounded-xl text-sm text-white focus:outline-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                                        >
                                            {showNewPass ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {errPass.newPassword && (
                                        <span className="text-xs text-rose-500 font-medium">{errPass.newPassword.message}</span>
                                    )}
                                </div>

                                {/* 3. Konfirmasi Kata Sandi Baru */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-400">Konfirmasi Kata Sandi</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showConfirmPass ? "text" : "password"}
                                            {...regPass('confirmNewPassword')}
                                            placeholder="••••••"
                                            className="w-full pl-4 pr-10 py-2 border border-gray-700 bg-gray-800 rounded-xl text-sm text-white focus:outline-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                                        >
                                            {showConfirmPass ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {errPass.confirmNewPassword && (
                                        <span className="text-xs text-rose-500 font-medium">{errPass.confirmNewPassword.message}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={subPass}
                                className="self-end px-5 py-2 bg-rose-600 hover:bg-emerald-400 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer mt-2 shadow-md"
                            >
                                {subPass ? 'Memvalidasi...' : 'Perbarui Kata Sandi'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}