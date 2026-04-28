import { Router } from 'express';
import { signup, signin, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authMiddleware, me);

export default router;
