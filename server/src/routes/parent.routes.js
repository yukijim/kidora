import { Router } from 'express';
import { getDashboardOverview } from '../controllers/parent.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/overview', getDashboardOverview);

export default router;
