import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from'@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma =  new PrismaClient({ adapter: adapter });

const getTransactions = async (req: Request , res: Response): Promise<void> => {
    try {
        const allTransactions = await prisma.transaction.findMany();
        res.status(200).json(allTransactions);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data" });
    }
};

// Fungsi untuk membuat transaksi baru
const createTransaction = async (req: Request, res: Response): Promise<void> => {
    //ambil data yang dikirim user input lewat body
    const { title, amount, type } = req.body;
    try {
        // Simpan ke database menggunakan prisma
        const newTransaction = await prisma.transaction.create({
            data: { title, amount, type }
        });
        // Berikan response sukses ke user
        res.status(201).json({ status: "Succes", data: newTransaction });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan transaksi" });
    }
};

// Fungsi untuk menghapus transaksi berdasarkan ID
const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    // Mengambil ID dari URL 
    const { id } = req.params;
    try {
        await prisma.transaction.delete({
            where: { id: parseInt(id as string) } // parseInt guna mengubah tek "2" menjadi angka 2
        });
        res.status(200).json({ status: "Succes", message: "Transaksi berhasil dihapuskan" });
    } catch (error) {
        res.status(404).json({ message: "Transaksi tidak ditemukan atau gagal dihapus!" });
    }
};

// Fungsi untuk mengubah/mengedit data transaksi
const updateTransaction = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Ambil ID dari URL
    const { title, amount, type } = req.body; //Ambil data baru hasil koreksi

    try {
        const updatedTransaction = await prisma.transaction.update({
            where: { id: parseInt(id as string) }, // cari data berdasarkan ID
            data: { title, amount, type }
        });
        res.status(200).json({ status: "Succes", data: updatedTransaction });
    } catch (error) {
        res.status(404).json({ message: "Transaksi tidak ditemukan atau gagal diubah!" });
    }
};

// Ekspor fungsi ini agar bisa dipakai di file Routes nanti
export default {
    getTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction
};