import express from 'express';
import { getProfile, updateProfile } from './profile.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router;
