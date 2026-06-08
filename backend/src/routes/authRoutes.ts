import { Router } from 'express';
import { register,  login } from '../controllers/authController';

const router = Router();

// Menghubungkan motode Post ke fungsi register (ini fungsi post jadi tidak get tidak dapat diintip!)
router.post('/register', register);
router.post('/login', login);

export default router;