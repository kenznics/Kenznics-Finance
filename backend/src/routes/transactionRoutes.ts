import express from 'express';
// Menggunakan gaya import modern tanpa kurung kurawal di controller nanti pakai export default
import transactionController from '../controllers/transactionController';
import { validateTransaction } from '../middlewares/validation';

const router = express.Router();

// Sekarang panggil fungsinya dengan tanda titik (.) di belakang nama controllernya
router.get('/', transactionController.getTransactions);
// Rute POST: Menambah data (Kita pasang validateTransaction di tengah sebagai satpam!)
router.post('/', validateTransaction , transactionController.createTransaction);
// Pintu baru untuk delete 
router.delete('/:id', transactionController.deleteTransaction);
// Pintu baru untuk PUT
router.put('/:id', validateTransaction, transactionController.updateTransaction);

export default router;