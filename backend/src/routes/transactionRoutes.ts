import transactionController from '../controllers/transactionController';
import { validateTransaction } from '../middlewares/validation';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddlerware';

const router = Router();

// Sekarang panggil fungsinya dengan tanda titik (.) di belakang nama controllernya
router.get('/', authMiddleware, transactionController.getTransactions);
// Rute POST: Menambah data (Kita pasang validateTransaction di tengah sebagai satpam!)
router.post('/', authMiddleware, validateTransaction , transactionController.createTransaction);
// Pintu baru untuk delete 
router.delete('/:id', transactionController.deleteTransaction);
// Pintu baru untuk PUT
router.put('/:id', validateTransaction, transactionController.updateTransaction);
// Pasang authMiddleware sebagai "pintu gerbang" sebelum masuk ke controller
// Sifatnya membaca dari kiri ke kanan: Jalankan authMiddleware dulu, kalau lolos baru jalankan getTransactions

export default router;