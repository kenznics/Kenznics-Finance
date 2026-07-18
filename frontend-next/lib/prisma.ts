import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg';

const prismaClientSingleton = () => {
    // Pool koneksi DB menggunakan module pg
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Membungkus pool menggunakan adapter prisma
    const adapter = new PrismaPg(pool);

    return new PrismaClient({ adapter });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}