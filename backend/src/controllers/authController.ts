import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from'@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter: adapter,
    log: ['query', 'info', 'warn', 'error']
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Peringatan Typo , Pastikan Email dan Passsword tidak boleh kosong!
        if (!email || !password) {
            res.status(400).json({ message: 'Email dan password wajib disi!' });
            return;
        }

        // Cek apakah Email sudah terdaftar di DB
        const exitingUser = await prisma.user.findUnique({
            where: { email:email } // hati-hati: huruf kecil semua properti email
        });
        
        if (exitingUser) {
            res.status(400).json({ message: 'Email telah digunakan!' });
            return;
        }

        // Sembunyikan password asli menggunakan bcrypt.hash
        // Anka 10 adalah 'saltrounds' (standard kemanan enkripsi)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user baru ke DB 
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        // Kirim Response sukses (jangan pernah mengembalikan password ke client!)
        res.status(201).json({
            message: 'Registrasi berhasil!',
            user: {
                id: newUser.id,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        // Menangani error tak terduga
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, password } = req.body;

        // Peringatan Validasi input kosong
        if (!email || !password) {
            res.status(400).json({ message: 'Email dan password wajib disi!' });
            return;
        }

        // cari user di db berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // Jika user tidak ada
        if (!user) {
            res.status(401).json({ message: 'Email atau password salah!' });
            return;
        }

        // Bandingkan password dari input dengan password terenkripsi di database
        // bcrypt.compare akan mengembalikan nilai true jika cocok, dan false jika salah
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            res.status(401).json({ message: 'Email atau password salah!' });
            return;
        }

        // Ambil kunci secret JWT dari file .env (jika kosong gunakan fallback teks)
        const secretKey = process.env.JWT_SECRET || 'KenzNik500.';

        // Buat Token JWT bawaan yang berisi ID user berlaku selama 1 hari
        const token = jwt.sign(
            { userId: user.id},
            secretKey,
            { expiresIn: '1d' }
        );

        // Kirim token ke client
        res.status(200).json({
            message: 'Login sukses!',
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server!', error });
    }
};