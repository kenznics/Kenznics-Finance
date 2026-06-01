import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';

// 1. KONFIGURASI DATABASE (Prisma 7 + Driver Adapter)
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const PORT = 3000;

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routing Induk 
app.use('/api/transactions', transactionRoutes);

// MENJALANKAN SERVER
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
