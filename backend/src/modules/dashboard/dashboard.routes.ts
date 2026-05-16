import { Router } from 'express';
import { getDashboard } from './dashboard.controller';
import authMiddleware from '../../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getDashboard);

export default router;