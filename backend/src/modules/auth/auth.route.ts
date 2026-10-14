import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, logoutUser, getMe, googleAuth, completeOnboarding } from './auth.controller';
import { protect, optionalAuth } from '../../middleware/auth.middleware';

const router = express.Router();

// Rate limiting for auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { status: 'error', message: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/google', authLimiter, googleAuth);
router.get('/me', optionalAuth, getMe);
router.post('/onboarding', protect, completeOnboarding);

export default router;
