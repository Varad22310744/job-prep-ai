import { Router } from 'express';
import { runAnalysis, getAnalysis, getAllUserAnalyses, getSuggestions } from './analysis.controller';
import authMiddleware from '../../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/run/:jobId', runAnalysis);
router.get('/job/:jobId', getAnalysis);
router.get('/', getAllUserAnalyses);
router.get('/suggestions/:jobId', getSuggestions);

export default router;