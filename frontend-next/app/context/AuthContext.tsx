"use client";

import { createContext, useState, useEffect, type ReactNode } from 'react';

// Definisi tipe data untuk isi state global 
interface AuthContextType {
    token: string | null;
    user: { name: string; email: string; image?: string } | null;
    login: (newToken: string) => void;
    logout: () => void;
}

// Context murni dengan nilai awal undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fungsi Komponen dan State token
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State menyimpan token , dengan nilai ENV variable
    const [token, setToken] = useState<string | null>(() => {
        // Memeriksa apakah objek 'window' browser sudah tersedia
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        // Jika masih diserver, kembalikan nilai null
        return null;
    });

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    const [isMounted, setIsMounted] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Gagal memuat profile pengguna', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchProfile();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(null);
        }
    }, [token]);

    const login = async (newToken: string) => {
        setToken(newToken);
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', newToken)
            // Baris untuk menyimpan cookie
            document.cookie = `authToken=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        await fetchProfile();
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken')
            // Menghapus cookie dengan memundurkan tanggal expirednya
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {isMounted ? children : <div className="opacity-0">{children}</div>}
        </AuthContext.Provider>
    );
};