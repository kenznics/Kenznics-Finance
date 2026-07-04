"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataProps {
    data: {
        name: string;
        Pemasukkan: number;
        Pengeluaran: number;
    }[];
}

export default function TransactionChart({ data }: ChartDataProps) {
    return (
        <div className="w-full h-[300px] bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-bold white-text">Tren Keuangan Bulanan</h3>
            <ResponsiveContainer width="100%" height="100%">

                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="Pemasukkan" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div >
    )
}