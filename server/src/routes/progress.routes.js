import { Router } from 'express';
import { getChildProgress, completeLesson, advanceMission } from '../controllers/progress.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/:childId', getChildProgress);
router.post('/complete-lesson', completeLesson);
router.post('/advance-mission', advanceMission);

export default router;
