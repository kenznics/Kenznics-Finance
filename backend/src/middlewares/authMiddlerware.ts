import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Membuat interface baru agar TS tahun req.user itu ada
interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Ambil token dari Header HTTP bernama Authorize
    const authHeader = req.headers.authorization;

    // Format standard untuk Bearer <Token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan!' });
        return;
    }

    // Potong kata "Bearer" untuk mengambil string token aslinya
    const token = authHeader.split(' ')[1]; // Waktunya

    try {
        // Bongkar Token menggunkan kunci rahasia yang sama dengan Login
        const secretKey = process.env.JWT_SECRET || 'KenzNik500.';
        const decode = jwt.verify(token, secretKey) as { userId: number};

        // Jika valid, simpan ID user ke dalam objek req agar bisa dipakai di controller transaksi
        req.userId = decode.userId;

        // Izinkan user melanjutkan perjalanan ke controller utama
        next();
    } catch (error) {
        // Token kadarluasa/palsu
        res.status(403).json({ messsage: 'Token tidak valid!' });
    }
};