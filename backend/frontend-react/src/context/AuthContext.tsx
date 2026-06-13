import { useState, type ReactNode } from 'react';
import { AuthContext } from './useAuth';
import { useNavigate } from 'react-router-dom';

// Fungsi Komponen dan State token
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State menyimpan token , dengan nilai ENV variable
    const [token, setToken] = useState<string | null>(import.meta.env.VITE_DEV_TOKEN || null);
    const navigate = useNavigate();

    const login = (newToken: string) => {
        setToken(newToken);
        navigate('/login')
    }

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};