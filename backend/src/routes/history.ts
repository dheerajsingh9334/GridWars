import { Router } from 'express';
import { getMyHistory } from '../controllers/historyController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getMyHistory);

export default router;
