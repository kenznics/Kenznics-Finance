import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes';

// 1. KONFIGURASI DATABASE (Prisma 7 + Driver Adapter)
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const PORT = 3000;

// 2. MIDDLEWARE
app.use(cors({
  origin: ['http://localhost:5173', 'https://hoppscotch.io' ], // Mengizinkan alamat frontEnd vite
  allowedHeaders: ['Content-Type', 'Authorization'], // Mengizinkan header Auhthorization ke backend
  credentials: true 
})); 

// Memperbolehkan frontend dari port mana saja untuk mengakses API
app.use(express.json());

// Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routing Induk 
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

// MENJALANKAN SERVER
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;