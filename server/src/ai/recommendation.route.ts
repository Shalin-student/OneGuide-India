import express from 'express';
import { getRecommendations } from './recommendation.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getRecommendations);

export default router;
