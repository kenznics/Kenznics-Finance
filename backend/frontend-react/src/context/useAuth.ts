import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Fungsi Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan didalam AuthProvider');
    }
    return context;
};
