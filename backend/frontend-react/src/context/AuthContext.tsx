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
    const [token, setToken] = useState<string | null>(import.meta.env.VITE_DEV_TOKEN || null);
    
    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};