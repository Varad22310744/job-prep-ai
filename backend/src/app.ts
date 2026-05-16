import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import errorHandler from './middleware/errorHandler';
import resumeRoutes from './modules/resume/resume.routes';
import jobRoutes from './modules/job/job.routes';
import analysisRoutes from './modules/analysis/analysis.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/jobs', jobRoutes);
app.use('/api/analysis', analysisRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use(errorHandler);

export default app;