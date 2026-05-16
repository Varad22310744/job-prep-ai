import { Router } from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import { addJob, getJobs, getJob, removeJob, getInterviewQuestions } from './job.controller';

const router = Router();
router.use(authMiddleware);

router.post('/', addJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.delete('/:id', removeJob);
router.get('/:jobId/interview-questions', getInterviewQuestions);
export default router;