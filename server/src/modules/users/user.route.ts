import express from 'express';
import { getUserProfile, saveService, unsaveService } from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/profile', getUserProfile);
router.post('/saved-services/:serviceId', saveService);
router.delete('/saved-services/:serviceId', unsaveService);

export default router;
