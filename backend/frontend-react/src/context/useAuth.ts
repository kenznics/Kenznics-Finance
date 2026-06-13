import { createContext, useContext } from 'react';

// Definisi tipe data 
export interface AuthContextType {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
}

// context murni
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fungsi Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan didalam AuthProvider');
    }
    return context;
};
