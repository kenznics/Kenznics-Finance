"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                {/* Konfigurasi Toaster agar stabil dan tidak mudah bug/delay */}
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    toastOptions={{
                        // Durasi toast muncul di layar
                        duration: 3000,
                        // Styling umum agar rapi dan tidak tertutup elemen lain
                        style: {
                            background: '#ffffff',
                            color: '#1e293b',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            zIndex: 99999,
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                {children}
            </QueryClientProvider>
        </AuthProvider>
    );
}