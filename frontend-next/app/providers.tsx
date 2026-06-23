"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
    // Instance queryClient didalam state agar cache tidak tertukar antar user
    const [queryClient] = useState(() => new QueryClient());

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-center"/>
                {children}
            </QueryClientProvider>
        </AuthProvider>
    );
}