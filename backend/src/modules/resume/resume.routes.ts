import { Router, Express } from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import upload from '../../utils/multer';
import { uploadResume, getResume, extractSkills } from './resume.controller';

// Add this line after the existing routes
const router = Router();

// All resume routes require authentication
router.use(authMiddleware);





router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResume);
router.post('/extract-skills', extractSkills);

export default router;