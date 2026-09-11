import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1); // Trust the first proxy (e.g., Nginx, Heroku, AWS ELB) to resolve true client IPs for rate limiting
}
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Note: express-mongo-sanitize is incompatible with Express 5's read-only req.query
// so we've removed the global middleware. Mongoose provides baseline protection.

// Database Connection
connectDB();

import authRoutes from './modules/auth/auth.route';
import categoryRoutes from './modules/categories/category.route';
import serviceRoutes from './modules/services/service.route';
import helplineRoutes from './modules/helplines/helpline.route';
import userRoutes from './modules/users/user.route';
import schemeRoutes from './modules/schemes/scheme.route';
import jobRoutes from './modules/jobs/job.route';
import internshipRoutes from './modules/internships/internship.route';
import scholarshipRoutes from './modules/scholarships/scholarship.route';
import documentRoutes from './modules/documents/document.route';
import governmentPortalRoutes from './modules/government-portals/governmentPortal.route';
import aiRoutes from './ai/ai.route';
import recommendationRoutes from './ai/recommendation.route';
import discoveryRoutes from './modules/discovery/discovery.route';
import savedResourceRoutes from './modules/saved-resources/savedResource.route';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/helplines', helplineRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/schemes', schemeRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/internships', internshipRoutes);
app.use('/api/v1/scholarships', scholarshipRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/government-portals', governmentPortalRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/discovery', discoveryRoutes);
app.use('/api/v1/saved-resources', savedResourceRoutes);

// Basic Route
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'OneGuide India API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
