import { Router } from 'express';
import { getAllTiles, claimTile, eraseTile } from '../controllers/tileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getAllTiles);
router.post('/claim', authMiddleware, claimTile);
router.post('/erase', authMiddleware, eraseTile);

export default router;
