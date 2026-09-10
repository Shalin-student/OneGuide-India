import express from 'express';
import { getAiResponse } from './ai.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/chat', optionalAuth, getAiResponse);

export default router;
