import { Router } from 'express';
import { register, login, verifyPin, updatePin, getCurrentParent } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-pin', authenticateToken, verifyPin);
router.post('/update-pin', authenticateToken, updatePin);
router.get('/me', authenticateToken, getCurrentParent);

export default router;
