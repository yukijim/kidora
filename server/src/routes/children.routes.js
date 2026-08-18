import { Router } from 'express';
import { getChildren, getChildById, createChild, updateChild } from '../controllers/children.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getChildren);
router.get('/:id', getChildById);
router.post('/', createChild);
router.put('/:id', updateChild);

export default router;
