import { Router } from 'express';
import { getSubjects, getLessons, getLessonById } from '../controllers/curriculum.controller.js';

const router = Router();

router.get('/subjects', getSubjects);
router.get('/lessons', getLessons);
router.get('/lessons/:id', getLessonById);

export default router;
