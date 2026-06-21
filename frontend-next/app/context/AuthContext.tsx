import { createContext, useState, type ReactNode } from 'react';

// Definisi tipe data untuk isi state global 
interface AuthContextType {
    token: string | null;
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

    const login = (newToken: string) => {
        setToken(newToken);
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', newToken)
        }
    };

    const logout = () => {
        setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken')
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};