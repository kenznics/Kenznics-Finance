import { createContext, useState, type ReactNode } from 'react';

// Definisi tipe data untuk isi state global 
interface AuthContextType {
    token: string | null;
    login : (newToken: string) => void;
    logout: () => void;
}

// Context murni dengan nilai awal undefined
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fungsi Komponen dan State token
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State menyimpan token , dengan nilai ENV variable
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('authToken');
    });
    
    const login = (newToken: string) => {
        setToken(newToken);
        // Simpan token ke localstorage
        localStorage.setItem('authToken', newToken)
    };

    const logout = () => {
        setToken(null);
        // Hapus token dari localstorage
        localStorage.removeItem('authToken')
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};